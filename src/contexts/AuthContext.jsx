import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON, uid } from '../lib/storage'

const USERS_KEY = 'lf_users'
const SESSION_KEY = 'lf_session'

const AuthContext = createContext(null)

function ensureSeedUsers(users) {
  const hasAdmin = users.some((u) => u.role === 'admin')
  if (hasAdmin) return users

  return [
    {
      id: uid('usr_'),
      name: 'Campus Admin',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      phone: '',
      createdAt: Date.now(),
    },
    ...users,
  ]
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => ensureSeedUsers(loadJSON(USERS_KEY, [])))
  const [session, setSession] = useState(() => loadJSON(SESSION_KEY, null))

  useEffect(() => {
    const seeded = ensureSeedUsers(users)
    if (seeded.length !== users.length) setUsers(seeded)
  }, [])

  useEffect(() => {
    saveJSON(USERS_KEY, users)
  }, [users])

  useEffect(() => {
    saveJSON(SESSION_KEY, session)
  }, [session])

  const currentUser = useMemo(() => {
    if (!session?.userId) return null
    return users.find((u) => u.id === session.userId) || null
  }, [session, users])

  function signup({ name, email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!normalizedEmail) {
      return { ok: false, error: 'Email is required.' }
    }
    if (!password || String(password).length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters.' }
    }
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: uid('usr_'),
      name: String(name || '').trim() || 'Student',
      email: normalizedEmail,
      password: String(password),
      role: 'student',
      phone: '',
      createdAt: Date.now(),
    }

    setUsers((prev) => [newUser, ...prev])
    setSession({ userId: newUser.id })
    return { ok: true }
  }

  function login({ email, password }) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== String(password)) {
      return { ok: false, error: 'Invalid email or password.' }
    }

    setSession({ userId: user.id })
    return { ok: true }
  }

  function logout() {
    setSession(null)
  }

  function updateProfile({ name, phone }) {
    if (!currentUser) return { ok: false, error: 'Not logged in.' }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, name: String(name || '').trim() || u.name, phone: String(phone || '').trim() }
          : u,
      ),
    )
    return { ok: true }
  }

  const value = useMemo(
    () => ({ currentUser, users, signup, login, logout, updateProfile }),
    [currentUser, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

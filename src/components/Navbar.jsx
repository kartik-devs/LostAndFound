import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Shield, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/items', label: 'Found Items' },
      { to: '/report', label: 'Report Found' },
      { to: '/help', label: 'Help' },
      { to: '/reviews', label: 'Reviews' },
      { to: '/sources', label: 'Sources' },
    ],
    [],
  )

  function onSearchSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/items?q=${encodeURIComponent(trimmed)}` : '/items')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-fuchsia-600 text-sm font-bold">
            LF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Campus Lost & Found</div>
            <div className="text-xs text-slate-400">Report and reclaim faster</div>
          </div>
        </Link>

        <form onSubmit={onSearchSubmit} className="ml-auto hidden w-full max-w-sm md:block">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items (bottle, keys, bag...)"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900">
              Search
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white',
                  isActive && 'bg-slate-900 text-white',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 md:flex',
                  isActive && 'bg-slate-900',
                )
              }
            >
              <Shield className="h-4 w-4" />
              Admin
            </NavLink>
          ) : null}

          {currentUser ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 md:flex',
                    isActive && 'bg-slate-900',
                  )
                }
              >
                <User className="h-4 w-4" />
                {currentUser.name}
              </NavLink>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link
                to="/signup"
                className="hidden rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white md:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white',
                  isActive && 'bg-slate-900 text-white',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}

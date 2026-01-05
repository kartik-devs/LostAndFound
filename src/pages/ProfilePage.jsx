import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth()

  const [name, setName] = useState(currentUser?.name || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [status, setStatus] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const res = updateProfile({ name, phone })
    if (!res.ok) {
      setStatus(res.error)
      return
    }
    setStatus('Profile updated.')
    setTimeout(() => setStatus(''), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Profile</div>
        <div className="mt-1 text-sm text-slate-400">Manage your account details.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Account</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <div className="text-xs font-semibold text-slate-500">Role</div>
              <div className="mt-1 text-slate-200">{currentUser?.role || 'student'}</div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{currentUser?.email}</span>
            </div>
            <div className="text-xs text-slate-500">(This demo stores credentials locally in your browser.)</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Update details</div>

          {status ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
              {status}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Phone (optional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

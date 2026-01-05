import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(() => {
    const from = location.state?.from
    return typeof from === 'string' ? from : '/'
  }, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    const res = login({ email, password })
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate(redirectTo)
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/50 via-slate-950 to-slate-950 p-8">
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-600 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-300">Campus Lost and Found</div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Nice to see you again
              <span className="block text-slate-300">Sign in to continue.</span>
            </h1>
            <p className="mt-4 text-sm text-slate-400">
              Report found items with photos, search approved listings, and request information or claim a listed item.
            </p>

            <div className="mt-8 rounded-3xl bg-gradient-to-br from-rose-700 to-rose-900 p-8">
              <div className="text-4xl font-semibold leading-tight text-white">Campus Lost</div>
              <div className="text-4xl font-semibold leading-tight text-white">and Found</div>
              <div className="mt-4 text-sm text-rose-100/90">
                Easily report or reclaim lost items at our school so everything finds its way back.
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Demo admin: <span className="text-slate-300">admin@campus.edu</span> / admin123
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
          <div className="text-sm font-semibold text-slate-300">Log in</div>
          <div className="mt-1 text-xs text-slate-500">Use your campus email</div>

          {error ? (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@campus.edu"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 focus-within:border-sky-500/60">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-slate-300 hover:bg-slate-900"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
              Sign in
            </button>

            <div className="text-center text-sm text-slate-400">
              Don’t have an account?
              <Link to="/signup" className="ml-2 font-semibold text-sky-300 hover:text-sky-200">
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

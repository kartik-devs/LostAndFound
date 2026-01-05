import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto flex min-h-full w-full max-w-6xl items-stretch px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}

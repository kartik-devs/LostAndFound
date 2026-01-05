import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
      <div className="text-2xl font-semibold text-white">Page not found</div>
      <div className="mt-2 text-sm text-slate-400">The page you’re looking for doesn’t exist.</div>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

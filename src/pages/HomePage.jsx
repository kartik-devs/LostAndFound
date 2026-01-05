import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, Search, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from '../components/ItemCard'

function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-lg font-semibold text-white">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-slate-400">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  )
}

function Tabs({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/40 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            value === opt.value
              ? 'rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900'
              : 'rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white'
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function HomePage() {
  const { currentUser } = useAuth()
  const { items } = useData()

  const [tab, setTab] = useState('approved')

  const approvedCount = items.filter((i) => i.status === 'approved').length
  const pendingCount = items.filter((i) => i.status === 'pending').length

  const visible = items
    .filter((i) => (tab === 'all' ? true : i.status === tab))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-950 p-8">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-rose-600 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Verified campus workflow
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-4xl">
              Campus Lost & Found
              <span className="block text-slate-300">Report items. Search listings. Claim with confidence.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              A simple, modern portal for students and staff to report found items and reunite them with their owners.
              Submit a report with a photo, browse approved listings, and request info or claim in seconds.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Report found item
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/items"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
              >
                Browse listings
                <Search className="h-4 w-4" />
              </Link>
              {currentUser?.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
                >
                  Admin dashboard
                  <ClipboardList className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid w-full max-w-sm gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs font-semibold text-slate-400">Approved listings</div>
              <div className="mt-1 text-3xl font-semibold text-white">{approvedCount}</div>
              <div className="mt-1 text-xs text-slate-500">Visible to students</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs font-semibold text-slate-400">Pending review</div>
              <div className="mt-1 text-3xl font-semibold text-white">{pendingCount}</div>
              <div className="mt-1 text-xs text-slate-500">Awaiting approval</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs font-semibold text-slate-400">Demo admin</div>
              <div className="mt-1 text-sm font-semibold text-white">admin@campus.edu</div>
              <div className="mt-1 text-xs text-slate-500">Password: admin123</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Recent reporting"
          subtitle="Newest reports, grouped in quick tabs"
          right={
            <Tabs
              value={tab}
              onChange={setTab}
              options={[
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'all', label: 'All' },
              ]}
            />
          }
        />

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300">
            No items in this tab yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((it) => (
              <ItemCard key={it.id} item={it} showStatus={true} />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
          >
            View all items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

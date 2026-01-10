import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, Search, ShieldCheck, TrendingUp, Users, Clock } from 'lucide-react'
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
              ? 'rounded-lg school-gradient px-3 py-1.5 text-sm font-semibold text-white transition-all'
              : 'rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors'
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, title, value, subtitle, gradient }) {
  return (
    <div className={`rounded-2xl border border-slate-800 p-4 glass-effect animate-fade-in ${gradient ? 'gradient-border' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-800/50 p-2">
          <Icon className="h-5 w-5 school-red" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-400">{title}</div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { currentUser } = useAuth()
  const { items, claims } = useData()

  const [tab, setTab] = useState('approved')

  const approvedCount = items.filter((i) => i.status === 'approved').length
  const pendingCount = items.filter((i) => i.status === 'pending').length
  const totalClaims = claims.length
  const recentItems = items.filter(i => Date.now() - i.createdAt < 7 * 24 * 60 * 60 * 1000).length

  const visible = items
    .filter((i) => (tab === 'all' ? true : i.status === tab))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-950 p-8">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full blur-3xl" style={{backgroundColor: '#7B0304'}} />
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-3xl" style={{backgroundColor: '#091E33'}} />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl" style={{backgroundColor: '#7B0304'}} />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-slate-300 animate-scale-in">
              <ShieldCheck className="h-4 w-4 school-red" />
              Secure campus workflow
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white lg:text-5xl animate-slide-up">
              Campus Lost & Found
              <span className="block school-gradient bg-clip-text text-transparent">
                Reunite. Recover. Restore.
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              A modern, intuitive platform for students and staff to report found items and reconnect them with their owners.
              Upload photos, browse verified listings, and claim items with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/report"
                className="group inline-flex items-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                Report found item
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/items"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800/60"
              >
                Browse listings
                <Search className="h-4 w-4" />
              </Link>
              {currentUser?.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800/60"
                >
                  Admin dashboard
                  <ClipboardList className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid w-full max-w-sm gap-4 lg:max-w-xs">
            <StatCard
              icon={TrendingUp}
              title="Active listings"
              value={approvedCount}
              subtitle="Available to claim"
              gradient
            />
            <StatCard
              icon={Clock}
              title="Pending review"
              value={pendingCount}
              subtitle="Awaiting approval"
            />
            <StatCard
              icon={Users}
              title="Total claims"
              value={totalClaims}
              subtitle="Items requested"
            />
            <StatCard
              icon={Search}
              title="This week"
              value={recentItems}
              subtitle="New reports"
            />
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="space-y-6">
        <SectionTitle
          title="Recent Activity"
          subtitle="Latest reports and updates from the community"
          right={
            <Tabs
              value={tab}
              onChange={setTab}
              options={[
                { value: 'approved', label: 'Live' },
                { value: 'pending', label: 'Pending' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'all', label: 'All' },
              ]}
            />
          }
        />

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 glass-effect p-8 text-center animate-fade-in">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-lg font-semibold text-slate-300 mb-2">No items found</div>
            <div className="text-sm text-slate-500">No items in this category yet. Check back later!</div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
            {visible.map((it, index) => (
              <div key={it.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ItemCard item={it} showStatus={true} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            to="/items"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800/60"
          >
            View all items
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}

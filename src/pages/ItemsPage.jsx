import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from '../components/ItemCard'

export default function ItemsPage() {
  const { currentUser } = useAuth()
  const { items } = useData()
  const [params, setParams] = useSearchParams()

  const initialQ = params.get('q') || ''
  const [q, setQ] = useState(initialQ)

  const statusParam = params.get('status') || 'approved'
  const categoryParam = params.get('category') || 'All'

  const statusOptions = useMemo(() => {
    if (currentUser?.role === 'admin') {
      return ['all', 'approved', 'pending', 'rejected']
    }
    return ['approved']
  }, [currentUser?.role])

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [items])

  const visible = useMemo(() => {
    const text = (params.get('q') || '').trim().toLowerCase()
    const selectedCategory = params.get('category') || 'All'
    const selectedStatus = params.get('status') || (currentUser?.role === 'admin' ? 'all' : 'approved')

    return items
      .filter((it) => {
        if (currentUser?.role !== 'admin' && it.status !== 'approved') return false
        if (selectedStatus !== 'all' && it.status !== selectedStatus) return false
        if (selectedCategory !== 'All' && it.category !== selectedCategory) return false
        if (!text) return true
        const hay = `${it.title} ${it.description} ${it.location} ${it.category}`.toLowerCase()
        return hay.includes(text)
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [items, params, currentUser?.role])

  function updateParam(next) {
    const nextParams = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') nextParams.delete(k)
      else nextParams.set(k, String(v))
    })
    setParams(nextParams)
  }

  function onSearchSubmit(e) {
    e.preventDefault()
    updateParam({ q: q.trim() })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-white">Found Items</div>
          <div className="mt-1 text-sm text-slate-400">Search and filter all listings.</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/report"
            className="rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Report found item
          </Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-3">
        <form onSubmit={onSearchSubmit} className="md:col-span-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, category, location..."
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900">
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={categoryParam}
            onChange={(e) => updateParam({ category: e.target.value })}
            className="w-full bg-transparent text-sm text-slate-100 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-950">
                {c}
              </option>
            ))}
          </select>
        </div>

        {currentUser?.role === 'admin' ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 md:col-span-3">
            <div className="text-xs font-semibold text-slate-500">Status</div>
            <select
              value={statusParam}
              onChange={(e) => updateParam({ status: e.target.value })}
              className="bg-transparent text-sm text-slate-100 outline-none"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-slate-950">
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300">
          No items match your search.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((it) => (
            <ItemCard key={it.id} item={it} showStatus={currentUser?.role === 'admin'} />
          ))}
        </div>
      )}
    </div>
  )
}

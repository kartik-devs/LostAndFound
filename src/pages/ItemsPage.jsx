import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, Grid, List, SortAsc, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from '../components/ItemCard'

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'school-gradient text-white'
          : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

export default function ItemsPage() {
  const { currentUser } = useAuth()
  const { items } = useData()
  const [params, setParams] = useSearchParams()

  const initialQ = params.get('q') || ''
  const [q, setQ] = useState(initialQ)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')

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

    let filtered = items.filter((it) => {
      if (currentUser?.role !== 'admin' && it.status !== 'approved') return false
      if (selectedStatus !== 'all' && it.status !== selectedStatus) return false
      if (selectedCategory !== 'All' && it.category !== selectedCategory) return false
      if (!text) return true
      const hay = `${it.title} ${it.description} ${it.location} ${it.category}`.toLowerCase()
      return hay.includes(text)
    })

    // Sort items
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
      default: // newest
        filtered.sort((a, b) => b.createdAt - a.createdAt)
    }

    return filtered
  }, [items, params, currentUser?.role, sortBy])

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

  const quickFilters = [
    { key: 'All', label: 'All Items', count: items.filter(i => currentUser?.role === 'admin' || i.status === 'approved').length },
    { key: 'Electronics', label: 'Electronics', count: items.filter(i => i.category === 'Electronics' && (currentUser?.role === 'admin' || i.status === 'approved')).length },
    { key: 'Keys', label: 'Keys', count: items.filter(i => i.category === 'Keys' && (currentUser?.role === 'admin' || i.status === 'approved')).length },
    { key: 'Bottle', label: 'Bottles', count: items.filter(i => i.category === 'Bottle' && (currentUser?.role === 'admin' || i.status === 'approved')).length },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-3xl font-bold text-white">Found Items</div>
          <div className="mt-2 text-slate-400">
            Browse {visible.length} items • Search and filter to find what you're looking for
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/report"
            className="group inline-flex items-center gap-2 rounded-xl school-gradient px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            Report found item
          </Link>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={`${filter.label} (${filter.count})`}
            active={categoryParam === filter.key}
            onClick={() => updateParam({ category: filter.key })}
          />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-6">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Search */}
          <form onSubmit={onSearchSubmit} className="lg:col-span-6">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, description, location..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <button className="rounded-lg school-gradient px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-105">
                Search
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <Filter className="h-5 w-5 text-slate-400" />
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
          </div>

          {/* Sort */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <SortAsc className="h-5 w-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="newest" className="bg-slate-950">Newest</option>
                <option value="oldest" className="bg-slate-950">Oldest</option>
                <option value="title" className="bg-slate-950">Title</option>
                <option value="category" className="bg-slate-950">Category</option>
              </select>
            </div>
          </div>

          {/* View Mode */}
          <div className="lg:col-span-1">
            <div className="flex rounded-xl border border-slate-700 bg-slate-950/40 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-school-red text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-school-red text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Admin Status Filter */}
        {currentUser?.role === 'admin' && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
            <div className="text-sm font-medium text-slate-400">Status:</div>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <FilterChip
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  active={statusParam === status}
                  onClick={() => updateParam({ status })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 glass-effect p-12 text-center animate-fade-in">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <div className="text-xl font-semibold text-slate-300 mb-2">No items found</div>
          <div className="text-slate-500 mb-6">Try adjusting your search terms or filters</div>
          <button
            onClick={() => {
              setQ('')
              updateParam({ q: '', category: 'All', status: 'approved' })
            }}
            className="rounded-xl border border-slate-700 glass-effect px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className={`animate-fade-in ${
          viewMode === 'grid' 
            ? 'grid gap-6 lg:grid-cols-2 xl:grid-cols-3' 
            : 'space-y-4'
        }`}>
          {visible.map((it, index) => (
            <div key={it.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <ItemCard item={it} showStatus={currentUser?.role === 'admin'} />
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {visible.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          Showing {visible.length} of {items.filter(i => currentUser?.role === 'admin' || i.status === 'approved').length} items
        </div>
      )}
    </div>
  )
}

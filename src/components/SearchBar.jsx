import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Filter, Sparkles, MapPin } from 'lucide-react'

export default function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Only show search bar on relevant pages
  const showOnPages = ['/', '/items', '/report']
  const shouldShow = showOnPages.includes(location.pathname)

  function onSearchSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/items?q=${encodeURIComponent(trimmed)}` : '/items')
  }

  if (!shouldShow) return null

  return (
    <div className="border-b border-slate-800/30 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm animate-slide-up">
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="flex flex-col gap-4">
          {/* Main search form */}
          <form onSubmit={onSearchSubmit} className="relative">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-1 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-600/50 hover:shadow-blue-500/10">
              <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-6 py-4">
                <Search className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for lost items... (bottle, keys, backpack, phone, etc.)"
                  className="flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-slate-700/60 hover:text-white"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <button
                  type="submit"
                  className="group/btn flex items-center gap-2 rounded-xl bg-school-red px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:opacity-90 hover:scale-105 hover:shadow-red-900/40"
                >
                  <Search className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Sparkles className="h-4 w-4" />
              Quick search:
            </span>
            {[
              { label: 'Keys', icon: '🔑' },
              { label: 'Phone', icon: '📱' },
              { label: 'Wallet', icon: '💳' },
              { label: 'Backpack', icon: '🎒' },
              { label: 'Laptop', icon: '💻' },
              { label: 'Jewelry', icon: '💍' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setQuery(item.label.toLowerCase())
                  navigate(`/items?q=${encodeURIComponent(item.label.toLowerCase())}`)
                }}
                className="group flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-sm text-slate-300 transition-all hover:bg-slate-700/60 hover:border-slate-600 hover:text-white hover:scale-105 hover:shadow-md"
              >
                <span className="text-xs transition-transform group-hover:scale-110">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Advanced filters (collapsible) */}
          {showFilters && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <select className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500">
                    <option value="">All locations</option>
                    <option value="library">Library</option>
                    <option value="cafeteria">Cafeteria</option>
                    <option value="gym">Gym</option>
                    <option value="parking">Parking lot</option>
                    <option value="classroom">Classroom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500">
                    <option value="">All categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date found
                  </label>
                  <select className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500">
                    <option value="">Any time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
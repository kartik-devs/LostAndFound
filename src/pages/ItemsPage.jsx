import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, Grid, List, SortAsc, Calendar, MapPin, Tag, X, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from '../components/ItemCard'

function FilterChip({ label, active, onClick, onRemove, removable = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'school-gradient text-white'
          : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
      }`}
    >
      {label}
      {removable && active && (
        <X 
          className="h-3 w-3 hover:text-red-300" 
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        />
      )}
    </button>
  )
}

function SavedSearchCard({ search, onLoad, onDelete }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{search.name}</div>
          <div className="text-xs text-slate-400 truncate">{search.query || 'All items'}</div>
          <div className="text-xs text-slate-500 mt-1">
            {search.filters.category && `Category: ${search.filters.category}`}
            {search.filters.location && ` • Location: ${search.filters.location}`}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => onLoad(search)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Load
          </button>
          <button
            onClick={() => onDelete(search.id)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ItemsPage() {
  const { currentUser } = useAuth()
  const { items } = useData()
  const [params, setParams] = useSearchParams()

  const [q, setQ] = useState(params.get('q') || '')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [savedSearches, setSavedSearches] = useState(() => 
    JSON.parse(localStorage.getItem('savedSearches') || '[]')
  )

  // Get all filter parameters
  const filters = {
    category: params.get('category') || '',
    location: params.get('location') || '',
    dateRange: params.get('dateRange') || '',
    status: params.get('status') || 'approved'
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  const locations = useMemo(() => {
    const set = new Set(items.map((i) => i.location.split(' - ')[0]).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  // Filter items based on all parameters
  const visible = useMemo(() => {
    const text = (params.get('q') || '').trim().toLowerCase()
    
    let filtered = items.filter((item) => {
      // Status filter
      if (currentUser?.role !== 'admin' && item.status !== 'approved') return false
      if (filters.status !== 'all' && filters.status !== 'approved' && item.status !== filters.status) return false
      if (filters.status === 'approved' && item.status !== 'approved') return false
      
      // Category filter
      if (filters.category && item.category !== filters.category) return false
      
      // Location filter
      if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      
      // Date range filter
      if (filters.dateRange) {
        const itemDate = new Date(item.createdAt)
        const now = new Date()
        const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24))
        
        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false
            break
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case '3months':
            if (daysDiff > 90) return false
            break
        }
      }
      
      // Text search
      if (text) {
        const searchText = `${item.title} ${item.description} ${item.location} ${item.category}`.toLowerCase()
        return searchText.includes(text)
      }
      
      return true
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
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location))
        break
      default: // newest
        filtered.sort((a, b) => b.createdAt - a.createdAt)
    }

    return filtered
  }, [items, params, currentUser?.role, sortBy, filters])

  function updateParam(next) {
    const nextParams = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') nextParams.delete(k)
      else nextParams.set(k, String(v))
    })
    setParams(nextParams)
  }

  function clearAllFilters() {
    setQ('')
    setParams(new URLSearchParams())
  }

  function saveCurrentSearch() {
    const searchName = prompt('Enter a name for this search:')
    if (!searchName) return

    const newSearch = {
      id: Date.now(),
      name: searchName,
      query: params.get('q') || '',
      filters: {
        category: params.get('category') || '',
        location: params.get('location') || '',
        dateRange: params.get('dateRange') || '',
        status: params.get('status') || 'approved'
      },
      createdAt: Date.now()
    }

    const updated = [...savedSearches, newSearch]
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  function loadSavedSearch(search) {
    setQ(search.query)
    const newParams = new URLSearchParams()
    if (search.query) newParams.set('q', search.query)
    Object.entries(search.filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value)
    })
    setParams(newParams)
    setShowSavedSearches(false)
  }

  function deleteSavedSearch(searchId) {
    const updated = savedSearches.filter(s => s.id !== searchId)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  // Active filters count
  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'approved').length + (params.get('q') ? 1 : 0)

  const quickFilters = [
    { key: '', label: 'All Items', count: items.filter(i => currentUser?.role === 'admin' || i.status === 'approved').length },
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
            Browse {visible.length} items • Advanced search and filtering available
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={saveCurrentSearch}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              Save Search
            </button>
          )}
          
          {savedSearches.length > 0 && (
            <button
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              <Clock className="h-4 w-4" />
              Saved ({savedSearches.length})
            </button>
          )}
          
          <Link
            to="/report"
            className="group inline-flex items-center gap-2 rounded-xl school-gradient px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            Report found item
          </Link>
        </div>
      </div>

      {/* Saved Searches */}
      {showSavedSearches && savedSearches.length > 0 && (
        <div className="rounded-2xl border border-slate-800 glass-effect p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">Saved Searches</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {savedSearches.map((search) => (
              <SavedSearchCard
                key={search.id}
                search={search}
                onLoad={loadSavedSearch}
                onDelete={deleteSavedSearch}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="rounded-2xl border border-blue-800/50 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-blue-300">
              Active Filters ({activeFiltersCount})
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {params.get('q') && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                <Search className="h-3 w-3" />
                "{params.get('q')}"
                <button onClick={() => updateParam({ q: '' })}>
                  <X className="h-3 w-3 hover:text-blue-100" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                <Tag className="h-3 w-3" />
                {filters.category}
                <button onClick={() => updateParam({ category: '' })}>
                  <X className="h-3 w-3 hover:text-purple-100" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
                <MapPin className="h-3 w-3" />
                {filters.location}
                <button onClick={() => updateParam({ location: '' })}>
                  <X className="h-3 w-3 hover:text-green-100" />
                </button>
              </span>
            )}
            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                <Calendar className="h-3 w-3" />
                {filters.dateRange}
                <button onClick={() => updateParam({ dateRange: '' })}>
                  <X className="h-3 w-3 hover:text-amber-100" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={`${filter.label} (${filter.count})`}
            active={filters.category === filter.key}
            onClick={() => updateParam({ category: filter.key })}
          />
        ))}
      </div>

      {/* Advanced Controls */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-6">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Sort */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <SortAsc className="h-5 w-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="newest" className="bg-slate-950">Newest First</option>
                <option value="oldest" className="bg-slate-950">Oldest First</option>
                <option value="title" className="bg-slate-950">Title A-Z</option>
                <option value="category" className="bg-slate-950">Category A-Z</option>
                <option value="location" className="bg-slate-950">Location A-Z</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <Tag className="h-5 w-5 text-slate-400" />
              <select
                value={filters.category}
                onChange={(e) => updateParam({ category: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-950">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-950">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <MapPin className="h-5 w-5 text-slate-400" />
              <select
                value={filters.location}
                onChange={(e) => updateParam({ location: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-950">All Locations</option>
                {locations.map((l) => (
                  <option key={l} value={l} className="bg-slate-950">
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <select
                value={filters.dateRange}
                onChange={(e) => updateParam({ dateRange: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-950">Any Time</option>
                <option value="today" className="bg-slate-950">Today</option>
                <option value="week" className="bg-slate-950">This Week</option>
                <option value="month" className="bg-slate-950">This Month</option>
                <option value="3months" className="bg-slate-950">3 Months</option>
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
              {['all', 'approved', 'pending', 'rejected'].map((status) => (
                <FilterChip
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  active={filters.status === status}
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
          <div className="text-slate-500 mb-6">
            {activeFiltersCount > 0 
              ? 'Try adjusting your search terms or filters' 
              : 'No items have been reported yet'
            }
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="rounded-xl border border-slate-700 glass-effect px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white"
            >
              Clear all filters
            </button>
          )}
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
          <Search className="h-4 w-4" />
          Showing {visible.length} of {items.filter(i => currentUser?.role === 'admin' || i.status === 'approved').length} total items
          {activeFiltersCount > 0 && ` • ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
        </div>
      )}
    </div>
  )
}

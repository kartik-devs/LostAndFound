import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Search, Filter, Sparkles, MapPin, Calendar, Tag, X, Clock, TrendingUp, Zap } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import SearchSuggestions from './SearchSuggestions'

export default function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { items } = useData()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    dateRange: searchParams.get('dateRange') || '',
    status: searchParams.get('status') || 'approved'
  })
  
  const searchRef = useRef(null)
  const containerRef = useRef(null)

  // Only show search bar on relevant pages
  const showOnPages = ['/', '/items', '/report']
  const shouldShow = showOnPages.includes(location.pathname)

  // Categories and locations for filters
  const categories = [...new Set(items.map(item => item.category))].sort()
  const locations = [...new Set(items.map(item => item.location.split(' - ')[0]))].sort()

  // Smart search suggestions based on user behavior
  const [searchStats, setSearchStats] = useState(() => {
    const saved = localStorage.getItem('searchStats')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function saveRecentSearch(searchQuery) {
    if (!searchQuery.trim()) return
    
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Update search statistics
    const stats = { ...searchStats }
    stats[searchQuery] = (stats[searchQuery] || 0) + 1
    setSearchStats(stats)
    localStorage.setItem('searchStats', JSON.stringify(stats))
  }

  function onSearchSubmit(e) {
    e.preventDefault()
    performSearch(query)
  }

  function performSearch(searchQuery, additionalFilters = {}) {
    const trimmed = searchQuery.trim()
    if (trimmed) {
      saveRecentSearch(trimmed)
    }
    
    const params = new URLSearchParams()
    if (trimmed) params.set('q', trimmed)
    
    const finalFilters = { ...filters, ...additionalFilters }
    Object.entries(finalFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      }
    })

    navigate(`/items${params.toString() ? `?${params.toString()}` : ''}`)
    setShowSuggestions(false)
    setIsSearchFocused(false)
  }

  function handleSuggestionClick(suggestionText) {
    setQuery(suggestionText)
    performSearch(suggestionText)
  }

  function handleQuickSearch(searchTerm) {
    setQuery(searchTerm)
    performSearch(searchTerm)
  }

  function clearFilters() {
    setFilters({
      category: '',
      location: '',
      dateRange: '',
      status: 'approved'
    })
  }

  function handleFilterChange(key, value) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Auto-apply filters if there's a query
    if (query.trim()) {
      performSearch(query, newFilters)
    }
  }

  // Get personalized quick searches based on user history
  const personalizedQuickSearches = Object.entries(searchStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([term]) => term)

  const quickSearchItems = [
    { label: 'Keys', icon: '🔑', term: 'keys' },
    { label: 'Phone', icon: '📱', term: 'phone' },
    { label: 'Wallet', icon: '💳', term: 'wallet' },
    { label: 'Backpack', icon: '🎒', term: 'backpack' },
    { label: 'Laptop', icon: '💻', term: 'laptop' },
    { label: 'Jewelry', icon: '💍', term: 'jewelry' },
  ]

  if (!shouldShow) return null

  return (
    <>
      {/* Search bar in normal position */}
      {!isSearchFocused && (
        <div className="relative border-b border-slate-800/30 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm animate-slide-up z-50">
          <div className="mx-auto w-full max-w-7xl px-6 py-6 relative z-50">
            <div className="flex flex-col gap-4">
              {/* Main search form */}
              <form onSubmit={onSearchSubmit} className="relative z-50" ref={containerRef}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-1 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-600/50 hover:shadow-blue-500/10 focus-within:border-blue-500/50 focus-within:shadow-blue-500/20">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-6 py-4">
                    <Search className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue-400 group-focus-within:text-blue-400" />
                    <div className="flex-1 relative">
                      <input
                        ref={searchRef}
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onFocus={() => {
                          setShowSuggestions(true)
                          setIsSearchFocused(true)
                        }}
                        placeholder="Search for lost items... (bottle, keys, backpack, phone, etc.)"
                        className="w-full bg-transparent text-base text-slate-100 placeholder:text-slate-500 outline-none"
                        aria-label="Search for lost items"
                        aria-describedby="search-help"
                        autoComplete="off"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                        showFilters || Object.values(filters).some(v => v && v !== 'approved')
                          ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                          : 'border-slate-600/50 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                      aria-label="Toggle advanced filters"
                      aria-expanded={showFilters}
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {Object.values(filters).filter(v => v && v !== 'approved').length > 0 && (
                        <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                          {Object.values(filters).filter(v => v && v !== 'approved').length}
                        </span>
                      )}
                    </button>
                    
                    <button
                      type="submit"
                      className="group/btn flex items-center gap-2 rounded-xl bg-school-red px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:opacity-90 hover:scale-105 hover:shadow-red-900/40"
                      aria-label="Search for items"
                    >
                      <Search className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Personalized + Quick search suggestions */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Sparkles className="h-4 w-4" />
                  Quick search:
                </span>
                
                {/* Personalized suggestions based on search history */}
                {personalizedQuickSearches.length > 0 && (
                  <>
                    {personalizedQuickSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="group flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-200 hover:scale-105 hover:shadow-md"
                      >
                        <Zap className="h-3 w-3 transition-transform group-hover:scale-110" />
                        {term}
                      </button>
                    ))}
                    <div className="h-4 w-px bg-slate-600" />
                  </>
                )}
                
                {/* Standard quick searches */}
                {quickSearchItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleQuickSearch(item.term)}
                    className="group flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-sm text-slate-300 transition-all hover:bg-slate-700/60 hover:border-slate-600 hover:text-white hover:scale-105 hover:shadow-md"
                    aria-label={`Quick search for ${item.label}`}
                  >
                    <span className="text-xs transition-transform group-hover:scale-110">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Advanced filters (collapsible) */}
              {showFilters && (
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-sm animate-fade-in relative z-50" role="region" aria-label="Advanced search filters">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                      aria-label="Clear all filters"
                    >
                      Clear all
                    </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label htmlFor="category-filter" className="block text-sm font-medium text-slate-300 mb-2">
                        <Tag className="inline h-4 w-4 mr-1" />
                        Category
                      </label>
                      <select 
                        id="category-filter"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        aria-describedby="category-help"
                      >
                        <option value="">All categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div id="category-help" className="sr-only">Filter items by category</div>
                    </div>
                    
                    <div>
                      <label htmlFor="location-filter" className="block text-sm font-medium text-slate-300 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Location
                      </label>
                      <select 
                        id="location-filter"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        aria-describedby="location-help"
                      >
                        <option value="">All locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <div id="location-help" className="sr-only">Filter items by campus location</div>
                    </div>
                    
                    <div>
                      <label htmlFor="date-filter" className="block text-sm font-medium text-slate-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Date Range
                      </label>
                      <select 
                        id="date-filter"
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        aria-describedby="date-help"
                      >
                        <option value="">Any time</option>
                        <option value="today">Today</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                        <option value="3months">Last 3 months</option>
                      </select>
                      <div id="date-help" className="sr-only">Filter items by when they were found</div>
                    </div>
                    
                    <div>
                      <label htmlFor="status-filter" className="block text-sm font-medium text-slate-300 mb-2">
                        Status
                      </label>
                      <select 
                        id="status-filter"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        aria-describedby="status-help"
                      >
                        <option value="approved">Available items</option>
                        <option value="all">All items</option>
                        <option value="pending">Pending approval</option>
                      </select>
                      <div id="status-help" className="sr-only">Filter items by approval status</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay search bar when focused */}
      {isSearchFocused && (
        <>
          {/* Blurred background overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-lg z-[100] animate-fade-in"
            onClick={() => {
              setShowSuggestions(false)
              setIsSearchFocused(false)
            }}
            aria-hidden="true"
            style={{ backdropFilter: 'blur(12px) saturate(0.7)' }}
          />
          
          {/* Centered search interface */}
          <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-6">
            <div className="w-full max-w-4xl">
              <form onSubmit={onSearchSubmit} className="relative" ref={containerRef}>
                <div className="group relative overflow-hidden rounded-3xl border border-slate-600/50 bg-gradient-to-r from-slate-800/90 to-slate-900/90 p-2 shadow-2xl backdrop-blur-xl transition-all">
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-900/90 px-8 py-6">
                    <Search className="h-6 w-6 text-blue-400" />
                    <div className="flex-1 relative">
                      <input
                        ref={searchRef}
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onBlur={(e) => {
                          // Don't hide suggestions if clicking within the suggestions area
                          if (!containerRef.current?.contains(e.relatedTarget)) {
                            // Small delay to allow for clicks on suggestions
                            setTimeout(() => {
                              setShowSuggestions(false)
                              setIsSearchFocused(false)
                            }, 150)
                          }
                        }}
                        placeholder="Search for lost items..."
                        className="w-full bg-transparent text-xl text-slate-100 placeholder:text-slate-400 outline-none"
                        aria-label="Search for lost items"
                        autoComplete="off"
                        autoFocus
                      />
                      
                      {/* Active filters display */}
                      {(filters.category || filters.location || filters.dateRange) && (
                        <div className="flex items-center gap-2 mt-3" role="group" aria-label="Active filters">
                          {filters.category && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                              <Tag className="h-3 w-3" />
                              {filters.category}
                              <button
                                type="button"
                                onClick={() => handleFilterChange('category', '')}
                                className="hover:text-blue-100"
                                aria-label={`Remove ${filters.category} filter`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {filters.location && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                              <MapPin className="h-3 w-3" />
                              {filters.location}
                              <button
                                type="button"
                                onClick={() => handleFilterChange('location', '')}
                                className="hover:text-purple-100"
                                aria-label={`Remove ${filters.location} filter`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                          {filters.dateRange && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
                              <Calendar className="h-3 w-3" />
                              {filters.dateRange}
                              <button
                                type="button"
                                onClick={() => handleFilterChange('dateRange', '')}
                                className="hover:text-green-100"
                                aria-label={`Remove ${filters.dateRange} filter`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-slate-500">
                      Press <kbd className="rounded bg-slate-800 px-2 py-1 text-xs">Esc</kbd> to close
                    </div>
                  </div>
                </div>

                {/* Enhanced Search Suggestions */}
                <SearchSuggestions
                  query={query}
                  onSuggestionClick={(suggestionText) => {
                    handleSuggestionClick(suggestionText)
                    setIsSearchFocused(false)
                  }}
                  onClose={() => {
                    setShowSuggestions(false)
                    setIsSearchFocused(false)
                  }}
                  isVisible={showSuggestions && isSearchFocused}
                />
              </form>
            </div>
          </div>
        </>
      )}
      
      {/* Screen reader help text */}
      <div id="search-help" className="sr-only">
        Search for lost items by typing keywords. Use the filters to narrow your search by category, location, or date range.
      </div>
    </>
  )
}
import { useState, useEffect } from 'react'
import { Search, Clock, TrendingUp, Tag, MapPin, Star, ArrowRight } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useNavigate } from 'react-router-dom'

export default function SearchSuggestions({ 
  query, 
  onSuggestionClick, 
  onClose, 
  isVisible 
}) {
  const { items } = useData()
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Get real-time item suggestions
  const itemSuggestions = query.length >= 2 ? items
    .filter(item => 
      item.status === 'approved' && 
      (item.title.toLowerCase().includes(query.toLowerCase()) ||
       item.description.toLowerCase().includes(query.toLowerCase()) ||
       item.category.toLowerCase().includes(query.toLowerCase()) ||
       item.location.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 8)
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      type: 'item',
      description: item.description,
      createdAt: item.createdAt
    })) : []

  // Get search term suggestions based on query
  const termSuggestions = query.length >= 1 ? [
    ...new Set([
      ...items.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).map(item => item.title.toLowerCase()),
      ...items.filter(item => 
        item.category.toLowerCase().includes(query.toLowerCase())
      ).map(item => item.category.toLowerCase())
    ])
  ].slice(0, 5).map(term => ({
    title: term,
    type: 'term',
    matches: items.filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    ).length
  })) : []

  // Recent searches from localStorage
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    .slice(0, 6)
    .map(search => ({
      title: search,
      type: 'recent',
      timestamp: Date.now() // In real app, you'd store actual timestamps
    }))

  // Popular/trending searches
  const popularSearches = [
    { title: 'keys', count: 45, trend: '+12%' },
    { title: 'phone', count: 38, trend: '+8%' },
    { title: 'wallet', count: 32, trend: '+15%' },
    { title: 'backpack', count: 28, trend: '+5%' },
    { title: 'laptop', count: 24, trend: '+20%' },
    { title: 'jewelry', count: 18, trend: '+3%' }
  ].map(search => ({
    ...search,
    type: 'popular'
  }))

  // Category suggestions
  const categorySuggestions = query.length >= 1 ? [
    ...new Set(items.map(item => item.category))
  ].filter(category => 
    category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4).map(category => ({
    title: category,
    type: 'category',
    count: items.filter(item => item.category === category).length
  })) : []

  // Location suggestions
  const locationSuggestions = query.length >= 1 ? [
    ...new Set(items.map(item => item.location.split(' - ')[0]))
  ].filter(location => 
    location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4).map(location => ({
    title: location,
    type: 'location',
    count: items.filter(item => item.location.includes(location)).length
  })) : []

  // All suggestions combined
  const allSuggestions = [
    ...itemSuggestions,
    ...termSuggestions,
    ...categorySuggestions,
    ...locationSuggestions
  ]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < allSuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
            handleSuggestionClick(allSuggestions[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, selectedIndex, allSuggestions, onClose])

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'item') {
      navigate(`/items/${suggestion.id}`)
    } else {
      onSuggestionClick(suggestion.title)
    }
  }

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (!isVisible) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-slate-700/50 bg-slate-900/98 backdrop-blur-sm shadow-2xl z-[60] max-h-[500px] overflow-y-auto">
      {/* Item Suggestions */}
      {itemSuggestions.length > 0 && (
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Search className="h-3 w-3" />
            Found Items ({itemSuggestions.length})
          </div>
          <div className="space-y-1">
            {itemSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  selectedIndex === index ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Tag className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {suggestion.category} • {suggestion.location}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">
                    {suggestion.description}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Term Suggestions */}
      {termSuggestions.length > 0 && query.length >= 1 && (
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Search className="h-3 w-3" />
            Search Suggestions
          </div>
          <div className="space-y-1">
            {termSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.title}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                  selectedIndex === itemSuggestions.length + index ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-slate-800/60'
                }`}
              >
                <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300 flex-1">{suggestion.title}</span>
                <span className="text-xs text-slate-500">{suggestion.matches} items</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category & Location Suggestions */}
      {(categorySuggestions.length > 0 || locationSuggestions.length > 0) && query.length >= 1 && (
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3">Filter by</div>
          <div className="grid gap-2 md:grid-cols-2">
            {categorySuggestions.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Categories</div>
                {categorySuggestions.map((suggestion) => (
                  <button
                    key={suggestion.title}
                    onClick={() => navigate(`/items?category=${encodeURIComponent(suggestion.title)}`)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <Tag className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">{suggestion.title}</span>
                    <span className="text-xs text-slate-500 ml-auto">({suggestion.count})</span>
                  </button>
                ))}
              </div>
            )}
            {locationSuggestions.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Locations</div>
                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.title}
                    onClick={() => navigate(`/items?location=${encodeURIComponent(suggestion.title)}`)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <MapPin className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">{suggestion.title}</span>
                    <span className="text-xs text-slate-500 ml-auto">({suggestion.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && query.length < 2 && (
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Recent Searches
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
              >
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300 flex-1">{search.title}</span>
                <span className="text-xs text-slate-500">Recent</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular/Trending Searches */}
      {query.length < 2 && (
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Trending Searches
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {popularSearches.map((search) => (
              <button
                key={search.title}
                onClick={() => handleSuggestionClick(search)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-slate-300">{search.title}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{search.count} searches</div>
                  <div className="text-xs text-green-400">{search.trend}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No suggestions message */}
      {query.length >= 2 && allSuggestions.length === 0 && (
        <div className="p-8 text-center">
          <Search className="h-8 w-8 text-slate-500 mx-auto mb-3" />
          <div className="text-sm text-slate-400 mb-2">No suggestions found</div>
          <div className="text-xs text-slate-500">Try a different search term</div>
        </div>
      )}

      {/* Keyboard navigation hint */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/50">
        <div className="text-xs text-slate-500 text-center">
          Use ↑↓ to navigate • Enter to select • Esc to close
        </div>
      </div>
    </div>
  )
}
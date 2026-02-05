import { Link } from 'react-router-dom'

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionTo, 
  actionOnClick,
  illustration 
}) {
  return (
    <div className="text-center py-12 px-6">
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <Icon className="h-16 w-16 mx-auto mb-6 text-slate-600" />
      ) : null}
      
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
      
      {(actionText && (actionTo || actionOnClick)) && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  )
}

// Specific empty state components
export function NoItemsFound() {
  return (
    <EmptyState
      illustration={
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4">
            <div className="text-4xl">🔍</div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <div className="text-lg">❌</div>
          </div>
        </div>
      }
      title="No items found"
      description="We couldn't find any items matching your search. Try adjusting your filters or search terms."
      actionText="Browse All Items"
      actionTo="/items"
    />
  )
}

export function NoReportedItems() {
  return (
    <EmptyState
      illustration={
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
          <div className="text-4xl">📦</div>
        </div>
      }
      title="No items reported yet"
      description="Start helping your campus community by reporting found items. Every item you report could help someone recover something important."
      actionText="Report Your First Item"
      actionTo="/report"
    />
  )
}

export function NoClaims() {
  return (
    <EmptyState
      illustration={
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mb-4 border border-green-500/20">
          <div className="text-4xl">🤝</div>
        </div>
      }
      title="No claims yet"
      description="When someone claims one of your reported items, you'll see the details here. Keep reporting items to help others!"
      actionText="View All Items"
      actionTo="/items"
    />
  )
}
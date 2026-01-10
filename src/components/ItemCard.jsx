import { Link } from 'react-router-dom'
import { MapPin, Tag, Calendar, Eye } from 'lucide-react'
import StatusBadge from './StatusBadge'

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ItemCard({ item, showStatus = false }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group block rounded-2xl border border-slate-800/70 glass-effect p-5 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20"
    >
      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-800">
          {item.imageDataUrl ? (
            <>
              <img src={item.imageDataUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </>
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-slate-500">
              <div className="text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 opacity-50" />
                <div>No photo</div>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white transition-colors group-hover:school-red">
                {item.title}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-slate-300">
                  <Tag className="h-4 w-4" />
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-slate-300">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </span>
              </div>
            </div>

            {showStatus && (
              <div className="flex-none">
                <StatusBadge status={item.status} />
              </div>
            )}
          </div>

          <div className="mt-3 text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Found on {item.dateFound || '—'}
            </span>
            <span className="font-medium">
              {timeAgo(item.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

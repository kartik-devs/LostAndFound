import { Link } from 'react-router-dom'
import { MapPin, Tag } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function ItemCard({ item, showStatus = false }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/60"
    >
      <div className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-800">
        {item.imageDataUrl ? (
          <img src={item.imageDataUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-slate-500">No photo</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white group-hover:text-sky-200">
              {item.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.location}
              </span>
            </div>
          </div>

          {showStatus ? <StatusBadge status={item.status} /> : null}
        </div>

        <div className="mt-2 text-sm text-slate-300">{item.description}</div>

        <div className="mt-3 text-xs text-slate-500">
          Found on <span className="text-slate-300">{item.dateFound || '—'}</span>
        </div>
      </div>
    </Link>
  )
}

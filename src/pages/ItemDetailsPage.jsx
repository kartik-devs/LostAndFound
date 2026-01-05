import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Tag } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import StatusBadge from '../components/StatusBadge'

export default function ItemDetailsPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const { items, addClaim } = useData()

  const item = useMemo(() => items.find((it) => it.id === id) || null, [items, id])

  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  if (!item) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300">
        Item not found. <Link to="/items">Back to list</Link>
      </div>
    )
  }

  const canView = item.status === 'approved' || currentUser?.role === 'admin'

  if (!canView) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-300">
        This listing is not publicly available yet.
      </div>
    )
  }

  function onSubmitClaim(e) {
    e.preventDefault()
    setStatus('')
    if (!currentUser) {
      setStatus('Please log in to submit a claim/inquiry.')
      return
    }
    if (!contact.trim() || !message.trim()) {
      setStatus('Please provide contact info and a message.')
      return
    }

    addClaim({ itemId: item.id, userId: currentUser.id, contact: contact.trim(), message: message.trim() })
    setContact('')
    setMessage('')
    setStatus('Request submitted. The admin team will review it.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">Item details</div>
          <div className="mt-1 text-2xl font-semibold text-white">{item.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {item.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {item.location}
            </span>
            <span className="text-slate-500">Found on</span>
            <span className="text-slate-200">{item.dateFound || '—'}</span>
          </div>
        </div>

        {currentUser?.role === 'admin' ? <StatusBadge status={item.status} /> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40">
          <div className="aspect-video bg-slate-950/40">
            {item.imageDataUrl ? (
              <img src={item.imageDataUrl} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-slate-500">No photo provided</div>
            )}
          </div>
          <div className="p-6">
            <div className="text-sm font-semibold text-white">Description</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-300">{item.description || '—'}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Claim / Inquiry</div>
          <div className="mt-1 text-sm text-slate-400">
            Request info from the admin team or claim this item.
          </div>

          {status ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
              {status}
            </div>
          ) : null}

          <form onSubmit={onSubmitClaim} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Contact (email or phone)</label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="you@campus.edu or +91 ..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe proof of ownership or ask for details..."
                rows={5}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <button className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
              Submit request
            </button>

            {!currentUser ? (
              <div className="text-xs text-slate-500">
                You need to <Link to="/login">log in</Link> to submit a request.
              </div>
            ) : null}
          </form>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/items"
          className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
        >
          Back to listings
        </Link>
      </div>
    </div>
  )
}

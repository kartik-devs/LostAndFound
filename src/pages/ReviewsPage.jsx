import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

function Stars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={n <= value ? 'text-amber-300' : 'text-slate-600'}
        >
          <Star className="h-5 w-5" fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const { currentUser } = useAuth()
  const { reviews, addReview } = useData()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('')

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  function onSubmit(e) {
    e.preventDefault()
    setStatus('')
    if (!currentUser) {
      setStatus('Please log in to leave a review.')
      return
    }
    if (!comment.trim()) {
      setStatus('Please write a short comment.')
      return
    }
    addReview({ userId: currentUser.id, rating, comment: comment.trim() })
    setComment('')
    setRating(5)
    setStatus('Thanks for your feedback!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold text-white">Reviews</div>
          <div className="mt-1 text-sm text-slate-400">Leave feedback for future students.</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
          <div className="text-xs font-semibold text-slate-500">Average rating</div>
          <div className="mt-1 text-2xl font-semibold text-white">{avg || '—'}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Write a review</div>
          <div className="mt-1 text-sm text-slate-400">What did you like? What can be improved?</div>

          {status ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
              {status}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500">Rating</div>
              <div className="mt-2">
                <Stars value={rating} onChange={setRating} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Share your experience..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
              Submit review
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">All reviews</div>
          <div className="mt-1 text-sm text-slate-400">Recent feedback from users.</div>

          {reviews.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-6 text-sm text-slate-300">
              No reviews yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-500">Rating</div>
                    <div className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-300" fill="currentColor" />
                    <div className="text-sm font-semibold text-white">{r.rating}/5</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { readFileAsDataUrl } from '../lib/storage'

const CATEGORIES = ['Bottle', 'Keys', 'ID Card', 'Electronics', 'Clothing', 'Bag', 'Other']

export default function ReportPage() {
  const { currentUser } = useAuth()
  const { addItem } = useData()
  const navigate = useNavigate()

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Other')
  const [location, setLocation] = useState('')
  const [dateFound, setDateFound] = useState(today)
  const [description, setDescription] = useState('')

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  async function onFileChange(e) {
    const f = e.target.files?.[0] || null
    setFile(f)
    setPreview('')
    if (!f) return
    const url = await readFileAsDataUrl(f)
    setPreview(url)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('')

    if (!title.trim() || !location.trim() || !description.trim()) {
      setStatus('Please fill in title, location, and description.')
      return
    }

    setBusy(true)
    try {
      const imageDataUrl = preview || ''
      const created = addItem({
        title: title.trim(),
        category,
        location: location.trim(),
        dateFound,
        description: description.trim(),
        imageDataUrl,
        reportedByUserId: currentUser?.id || null,
      })

      navigate(`/items/${created.id}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Report Found Item</div>
        <div className="mt-1 text-sm text-slate-400">
          Submit a report with a photo. Listings require admin approval before appearing publicly.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Item photo</div>
          <div className="mt-1 text-sm text-slate-400">Upload a clear image if possible.</div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/30">
            <div className="aspect-video">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    No photo selected
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
            />
            {file ? <div className="mt-2 text-xs text-slate-500">Selected: {file.name}</div> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Report details</div>

          {status ? (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
              {status}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Black water bottle"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500/60"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-950">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400">Date found</label>
                <input
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  type="date"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500/60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Location found</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Library - 2nd floor"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Add color, brand, identifying marks..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-sky-500/60"
              />
            </div>

            <button
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Submitting...' : 'Submit for review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

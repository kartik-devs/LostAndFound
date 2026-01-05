import { useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useData } from '../contexts/DataContext'

function Tabs({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/40 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            value === opt.value
              ? 'rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900'
              : 'rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white'
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function AdminPage() {
  const { items, claims, setItemStatus, deleteItem, updateClaimStatus } = useData()
  const [tab, setTab] = useState('pending')

  const itemTabs = useMemo(
    () => [
      { value: 'pending', label: 'Pending items' },
      { value: 'approved', label: 'Approved items' },
      { value: 'rejected', label: 'Rejected items' },
      { value: 'claims', label: 'Claims / inquiries' },
    ],
    [],
  )

  const pendingItems = useMemo(
    () => items.filter((i) => i.status === 'pending').sort((a, b) => b.createdAt - a.createdAt),
    [items],
  )
  const approvedItems = useMemo(
    () => items.filter((i) => i.status === 'approved').sort((a, b) => b.createdAt - a.createdAt),
    [items],
  )
  const rejectedItems = useMemo(
    () => items.filter((i) => i.status === 'rejected').sort((a, b) => b.createdAt - a.createdAt),
    [items],
  )

  const claimsList = useMemo(() => claims.slice().sort((a, b) => b.createdAt - a.createdAt), [claims])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Admin Dashboard</div>
        <div className="mt-1 text-sm text-slate-400">Review, approve, reject, or delete item postings.</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} options={itemTabs} />
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
          Pending: <span className="text-slate-200">{pendingItems.length}</span>
        </div>
      </div>

      {tab === 'pending' ? (
        <ItemTable
          title="Pending review"
          items={pendingItems}
          onApprove={(id) => setItemStatus(id, 'approved')}
          onReject={(id) => setItemStatus(id, 'rejected')}
          onDelete={deleteItem}
        />
      ) : null}

      {tab === 'approved' ? (
        <ItemTable
          title="Approved"
          items={approvedItems}
          onApprove={null}
          onReject={(id) => setItemStatus(id, 'rejected')}
          onDelete={deleteItem}
        />
      ) : null}

      {tab === 'rejected' ? (
        <ItemTable
          title="Rejected"
          items={rejectedItems}
          onApprove={(id) => setItemStatus(id, 'approved')}
          onReject={null}
          onDelete={deleteItem}
        />
      ) : null}

      {tab === 'claims' ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-sm font-semibold text-white">Claims / inquiries</div>
          <div className="mt-1 text-sm text-slate-400">Students requests to claim or ask for information.</div>

          {claimsList.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-6 text-sm text-slate-300">
              No claims submitted yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {claimsList.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Claim ID</div>
                      <div className="font-mono text-xs text-slate-300">{c.id}</div>
                    </div>
                    <div className="text-xs text-slate-500">{timeAgo(c.createdAt)}</div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Item</div>
                      <div className="mt-1 text-slate-200">{items.find((i) => i.id === c.itemId)?.title || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Contact</div>
                      <div className="mt-1 text-slate-200">{c.contact}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs font-semibold text-slate-500">Message</div>
                      <div className="mt-1 text-slate-200">{c.message}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Status: <span className="text-slate-200">{c.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateClaimStatus(c.id, 'in_review')}
                        className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900"
                      >
                        Mark in review
                      </button>
                      <button
                        onClick={() => updateClaimStatus(c.id, 'resolved')}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                      >
                        Mark resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function ItemTable({ title, items, onApprove, onReject, onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="text-sm font-semibold text-white">{title}</div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/30 p-6 text-sm text-slate-300">
          Nothing here yet.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs font-semibold text-slate-500">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Location</th>
                <th className="py-2">Found date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {items.map((it) => (
                <tr key={it.id} className="border-t border-slate-800">
                  <td className="py-3 pr-4 font-semibold text-white">{it.title}</td>
                  <td className="py-3 pr-4">{it.category}</td>
                  <td className="py-3 pr-4">{it.location}</td>
                  <td className="py-3 pr-4">{it.dateFound || '—'}</td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{it.status}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {onApprove ? (
                        <button
                          onClick={() => onApprove(it.id)}
                          className="rounded-xl bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/30"
                        >
                          Approve
                        </button>
                      ) : null}
                      {onReject ? (
                        <button
                          onClick={() => onReject(it.id)}
                          className="rounded-xl bg-amber-400/15 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-500/30"
                        >
                          Reject
                        </button>
                      ) : null}
                      <button
                        onClick={() => onDelete(it.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-200 ring-1 ring-rose-500/30"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

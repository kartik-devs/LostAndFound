import { useMemo, useState } from 'react'
import { Trash2, Check, X, Eye, Download, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

function Tabs({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/40 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            value === opt.value
              ? 'rounded-lg school-gradient px-4 py-2 text-sm font-semibold text-white transition-all'
              : 'rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors'
          }
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              value === opt.value ? 'bg-white/20' : 'bg-slate-700'
            }`}>
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, title, value, subtitle, color = 'red' }) {
  const colorClasses = {
    red: 'school-red bg-red-500/10 border-red-500/20',
    blue: 'school-blue bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  }
  
  return (
    <div className={`rounded-2xl border p-4 glass-effect ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-800/50 p-2">
          <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[0]}`} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-400">{title}</div>
          <div className="mt-1 text-2xl font-bold text-white">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
        </div>
      </div>
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

function ActionButton({ onClick, variant, children, disabled = false }) {
  const variants = {
    approve: 'bg-green-500/15 text-green-200 ring-1 ring-green-500/30 hover:bg-green-500/25',
    reject: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30 hover:bg-amber-500/25',
    delete: 'bg-red-500/15 text-red-200 ring-1 ring-red-500/30 hover:bg-red-500/25',
    view: 'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30 hover:bg-slate-500/25'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default function AdminPage() {
  const { items, claims, setItemStatus, deleteItem, updateClaimStatus } = useData()
  const { users } = useAuth()
  const [tab, setTab] = useState('pending')
  const [selectedItems, setSelectedItems] = useState(new Set())

  const stats = useMemo(() => {
    const pending = items.filter(i => i.status === 'pending').length
    const approved = items.filter(i => i.status === 'approved').length
    const rejected = items.filter(i => i.status === 'rejected').length
    const totalClaims = claims.length
    
    return { pending, approved, rejected, totalClaims }
  }, [items, claims])

  const itemTabs = useMemo(
    () => [
      { value: 'pending', label: 'Pending', count: stats.pending },
      { value: 'approved', label: 'Approved', count: stats.approved },
      { value: 'rejected', label: 'Rejected', count: stats.rejected },
      { value: 'claims', label: 'Claims', count: stats.totalClaims },
    ],
    [stats],
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

  function handleBulkAction(action) {
    selectedItems.forEach(itemId => {
      if (action === 'delete') {
        deleteItem(itemId)
      } else {
        setItemStatus(itemId, action)
      }
    })
    setSelectedItems(new Set())
  }

  function exportData() {
    const data = {
      items,
      claims,
      users: users.map(u => ({ ...u, password: '[REDACTED]' })),
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lost-found-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-3xl font-bold text-white">Admin Dashboard</div>
          <div className="mt-2 text-slate-400">
            Manage item reports, review submissions, and handle user claims
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800/60"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          title="Pending Review"
          value={stats.pending}
          subtitle="Awaiting approval"
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          title="Approved Items"
          value={stats.approved}
          subtitle="Live listings"
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Rejected Items"
          value={stats.rejected}
          subtitle="Not approved"
          color="red"
        />
        <StatCard
          icon={Users}
          title="Total Claims"
          value={stats.totalClaims}
          subtitle="User requests"
          color="blue"
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={tab} onChange={setTab} options={itemTabs} />
        
        {selectedItems.size > 0 && tab !== 'claims' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{selectedItems.size} selected</span>
            <ActionButton onClick={() => handleBulkAction('approved')} variant="approve">
              <Check className="h-4 w-4" />
              Approve
            </ActionButton>
            <ActionButton onClick={() => handleBulkAction('rejected')} variant="reject">
              <X className="h-4 w-4" />
              Reject
            </ActionButton>
            <ActionButton onClick={() => handleBulkAction('delete')} variant="delete">
              <Trash2 className="h-4 w-4" />
              Delete
            </ActionButton>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === 'pending' && (
        <ItemTable
          title="Pending Review"
          items={pendingItems}
          onApprove={(id) => setItemStatus(id, 'approved')}
          onReject={(id) => setItemStatus(id, 'rejected')}
          onDelete={deleteItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      )}

      {tab === 'approved' && (
        <ItemTable
          title="Approved Items"
          items={approvedItems}
          onReject={(id) => setItemStatus(id, 'rejected')}
          onDelete={deleteItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      )}

      {tab === 'rejected' && (
        <ItemTable
          title="Rejected Items"
          items={rejectedItems}
          onApprove={(id) => setItemStatus(id, 'approved')}
          onDelete={deleteItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      )}

      {tab === 'claims' && (
        <ClaimsTable claims={claimsList} items={items} updateClaimStatus={updateClaimStatus} />
      )}
    </div>
  )
}

function ItemTable({ title, items, onApprove, onReject, onDelete, selectedItems, onSelectionChange }) {
  function toggleSelection(itemId) {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    onSelectionChange(newSelection)
  }

  function toggleAll() {
    if (selectedItems.size === items.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(items.map(i => i.id)))
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 glass-effect p-6 animate-slide-up">
      <div className="text-lg font-semibold text-white mb-4">{title}</div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-8 text-center">
          <div className="text-slate-400">No items in this category yet.</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-xs font-semibold text-slate-500 border-b border-slate-800">
              <tr>
                <th className="py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === items.length && items.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-600 bg-slate-800 text-red-500 focus:ring-red-500"
                  />
                </th>
                <th className="py-3">Item</th>
                <th className="py-3">Category</th>
                <th className="py-3">Location</th>
                <th className="py-3">Date Found</th>
                <th className="py-3">Reported</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {items.map((it) => (
                <tr key={it.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(it.id)}
                      onChange={() => toggleSelection(it.id)}
                      className="rounded border-slate-600 bg-slate-800 text-red-500 focus:ring-red-500"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      {it.imageDataUrl && (
                        <img src={it.imageDataUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <div className="font-semibold text-white">{it.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{it.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">{it.category}</span>
                  </td>
                  <td className="py-4 pr-4 text-slate-300">{it.location}</td>
                  <td className="py-4 pr-4 text-slate-400">{it.dateFound || '—'}</td>
                  <td className="py-4 pr-4 text-xs text-slate-500">{timeAgo(it.createdAt)}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton onClick={() => window.open(`/items/${it.id}`, '_blank')} variant="view">
                        <Eye className="h-4 w-4" />
                      </ActionButton>
                      {onApprove && (
                        <ActionButton onClick={() => onApprove(it.id)} variant="approve">
                          <Check className="h-4 w-4" />
                        </ActionButton>
                      )}
                      {onReject && (
                        <ActionButton onClick={() => onReject(it.id)} variant="reject">
                          <X className="h-4 w-4" />
                        </ActionButton>
                      )}
                      <ActionButton onClick={() => onDelete(it.id)} variant="delete">
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
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

function ClaimsTable({ claims, items, updateClaimStatus }) {
  return (
    <div className="rounded-3xl border border-slate-800 glass-effect p-6 animate-slide-up">
      <div className="text-lg font-semibold text-white mb-4">Claims & Inquiries</div>
      <div className="text-sm text-slate-400 mb-6">Student requests to claim items or ask for information</div>

      {claims.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-8 text-center">
          <div className="text-slate-400">No claims submitted yet.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((c) => {
            const item = items.find(i => i.id === c.itemId)
            return (
              <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {item?.imageDataUrl && (
                      <img src={item.imageDataUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <div className="font-semibold text-white">{item?.title || 'Unknown Item'}</div>
                      <div className="text-sm text-slate-400">Claim ID: {c.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      c.status === 'resolved' ? 'bg-green-500/20 text-green-300' :
                      c.status === 'in_review' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">{timeAgo(c.createdAt)}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">Contact</div>
                    <div className="text-slate-200">{c.contact}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">Message</div>
                    <div className="text-slate-200">{c.message}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ActionButton onClick={() => updateClaimStatus(c.id, 'in_review')} variant="view">
                    Mark In Review
                  </ActionButton>
                  <ActionButton onClick={() => updateClaimStatus(c.id, 'resolved')} variant="approve">
                    Mark Resolved
                  </ActionButton>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

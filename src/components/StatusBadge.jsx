const styles = {
  approved: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  rejected: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
}

export default function StatusBadge({ status }) {
  const key = status || 'pending'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ${
        styles[key] || styles.pending
      }`}
    >
      {String(key).toUpperCase()}
    </span>
  )
}

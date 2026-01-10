import { useState } from 'react'
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { downloadBackup, importBackup, clearAllData, getStorageStats } from '../lib/backup'

function SettingsCard({ title, description, children, variant = 'default' }) {
  const variants = {
    default: 'border-slate-800 glass-effect',
    warning: 'border-amber-500/40 bg-amber-500/5',
    danger: 'border-rose-500/40 bg-rose-500/5'
  }
  
  return (
    <div className={`rounded-2xl border p-6 ${variants[variant]}`}>
      <div className="mb-4">
        <div className="text-lg font-semibold text-white">{title}</div>
        <div className="text-sm text-slate-400">{description}</div>
      </div>
      {children}
    </div>
  )
}

function ActionButton({ onClick, variant, children, disabled = false }) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105',
    secondary: 'border border-slate-700 glass-effect text-slate-200 hover:border-slate-600',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:scale-105'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:hover:scale-100 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default function SettingsPage() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState(() => getStorageStats())
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <div className="text-xl font-semibold text-white mb-2">Access Denied</div>
          <div className="text-slate-400">Only administrators can access settings.</div>
        </div>
      </div>
    )
  }

  function handleExport() {
    try {
      downloadBackup()
      setStatus('Backup downloaded successfully!')
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      setStatus('Failed to create backup: ' + error.message)
      setTimeout(() => setStatus(''), 5000)
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const backup = await importBackup(file)
      setStats(getStorageStats())
      setStatus(`Backup restored successfully! Imported from ${new Date(backup.exportedAt).toLocaleDateString()}`)
      setTimeout(() => {
        window.location.reload() // Refresh to load new data
      }, 2000)
    } catch (error) {
      setStatus('Failed to restore backup: ' + error.message)
    } finally {
      setLoading(false)
      e.target.value = '' // Reset file input
    }
  }

  function handleClearData() {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return
    }
    
    if (!confirm('This will delete ALL items, users, and claims. Type "DELETE" to confirm.')) {
      return
    }

    try {
      clearAllData()
      setStats(getStorageStats())
      setStatus('All data cleared successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      setStatus('Failed to clear data: ' + error.message)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="text-3xl font-bold text-white">Settings</div>
        <div className="mt-2 text-slate-400">
          Manage your Lost & Found application data and configuration
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`rounded-xl border p-4 ${
          status.includes('Failed') || status.includes('Error')
            ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {status.includes('Failed') || status.includes('Error') ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            {status}
          </div>
        </div>
      )}

      {/* Storage Statistics */}
      <SettingsCard
        title="Storage Statistics"
        description="Current data usage and storage breakdown"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-400" />
              <div className="text-sm font-medium text-slate-300">Total Size</div>
            </div>
            <div className="text-2xl font-bold text-white">{stats.formatted}</div>
          </div>
          
          {Object.entries(stats.breakdown).map(([key, data]) => (
            <div key={key} className="rounded-xl bg-slate-800/30 p-4">
              <div className="text-xs font-medium text-slate-400 mb-1">
                {key.replace('lf_', '').toUpperCase()}
              </div>
              <div className="text-lg font-semibold text-white">{data.items}</div>
              <div className="text-xs text-slate-500">
                {(data.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Data Management */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Backup & Export */}
        <SettingsCard
          title="Backup & Export"
          description="Download your data for safekeeping or migration"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                Exports all items, claims, and user data (passwords excluded) in JSON format.
              </div>
            </div>
            
            <ActionButton onClick={handleExport} variant="primary">
              <Download className="h-4 w-4" />
              Download Backup
            </ActionButton>
          </div>
        </SettingsCard>

        {/* Import & Restore */}
        <SettingsCard
          title="Import & Restore"
          description="Restore data from a previous backup file"
          variant="warning"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-200">
                This will overwrite existing data. Make sure to backup current data first.
              </div>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <ActionButton variant="secondary" disabled={loading}>
                <Upload className="h-4 w-4" />
                {loading ? 'Importing...' : 'Import Backup'}
              </ActionButton>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Danger Zone */}
      <SettingsCard
        title="Danger Zone"
        description="Irreversible actions that affect all data"
        variant="danger"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5" />
            <div className="text-sm text-rose-200">
              <strong>Warning:</strong> These actions cannot be undone. Make sure to backup your data first.
            </div>
          </div>
          
          <ActionButton onClick={handleClearData} variant="danger">
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </ActionButton>
        </div>
      </SettingsCard>

      {/* App Information */}
      <SettingsCard
        title="Application Information"
        description="Version and technical details"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">Version</div>
            <div className="text-sm text-white">1.0.0</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">Storage Type</div>
            <div className="text-sm text-white">Local Storage</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">Last Updated</div>
            <div className="text-sm text-white">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
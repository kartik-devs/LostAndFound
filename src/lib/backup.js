import { loadJSON, saveJSON } from './storage'

const BACKUP_KEYS = ['lf_users', 'lf_items', 'lf_claims', 'lf_reviews', 'lf_session']

export function exportAllData() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {}
  }
  
  BACKUP_KEYS.forEach(key => {
    data.data[key] = loadJSON(key, [])
  })
  
  // Remove sensitive data
  if (data.data.lf_users) {
    data.data.lf_users = data.data.lf_users.map(user => ({
      ...user,
      password: '[REDACTED]'
    }))
  }
  
  return data
}

export function downloadBackup() {
  const data = exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `lost-found-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result)
        
        if (!backup.version || !backup.data) {
          throw new Error('Invalid backup file format')
        }
        
        // Restore data (excluding session and passwords)
        Object.entries(backup.data).forEach(([key, value]) => {
          if (key !== 'lf_session' && Array.isArray(value)) {
            saveJSON(key, value)
          }
        })
        
        resolve(backup)
      } catch (error) {
        reject(new Error('Failed to parse backup file: ' + error.message))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function clearAllData() {
  BACKUP_KEYS.forEach(key => {
    localStorage.removeItem(key)
  })
}

export function getStorageStats() {
  let totalSize = 0
  const stats = {}
  
  BACKUP_KEYS.forEach(key => {
    const data = localStorage.getItem(key)
    const size = data ? new Blob([data]).size : 0
    stats[key] = {
      size,
      items: data ? JSON.parse(data).length || 0 : 0
    }
    totalSize += size
  })
  
  return {
    total: totalSize,
    breakdown: stats,
    formatted: formatBytes(totalSize)
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
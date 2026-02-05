import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-500/10 border-green-500/20 text-green-200',
    iconClass: 'text-green-400'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-500/10 border-red-500/20 text-red-200',
    iconClass: 'text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
    iconClass: 'text-amber-400'
  },
  info: {
    icon: Info,
    className: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
    iconClass: 'text-blue-400'
  }
}

export function Toast({ toast, onClose }) {
  const { icon: Icon, className, iconClass } = toastTypes[toast.type] || toastTypes.info

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 backdrop-blur-sm shadow-lg animate-slide-up ${className}`}>
      <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
      <div className="flex-1">
        {toast.title && (
          <div className="font-semibold text-sm">{toast.title}</div>
        )}
        <div className="text-sm opacity-90">{toast.message}</div>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
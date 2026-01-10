import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { readFileAsDataUrl } from '../lib/storage'

const CATEGORIES = ['Bottle', 'Keys', 'ID Card', 'Electronics', 'Clothing', 'Bag', 'Jewelry', 'Books', 'Other']

function FormField({ label, error, children, required = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-300">
        {label} {required && <span className="school-red">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-sm school-red">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

function SuccessMessage({ onClose }) {
  return (
    <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <div>
          <div className="font-semibold text-green-300">Report submitted successfully!</div>
          <div className="text-sm text-green-400/80">Your item will be reviewed by an admin before being published.</div>
        </div>
        <button onClick={onClose} className="ml-auto text-green-400 hover:text-green-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function ReportPage() {
  const { currentUser } = useAuth()
  const { addItem } = useData()
  const navigate = useNavigate()

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    location: '',
    dateFound: today,
    description: ''
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  async function onFileChange(e) {
    const f = e.target.files?.[0] || null
    setFile(f)
    setPreview('')
    
    if (!f) return
    
    // Validate file size (5MB limit)
    if (f.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5MB' }))
      return
    }
    
    // Validate file type
    if (!f.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
      return
    }
    
    try {
      const url = await readFileAsDataUrl(f)
      setPreview(url)
      setErrors(prev => ({ ...prev, image: null }))
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }))
    }
  }

  function validateForm() {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    if (!formData.dateFound) {
      newErrors.dateFound = 'Date found is required'
    }
    
    return newErrors
  }

  async function onSubmit(e) {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setBusy(true)
    try {
      const created = addItem({
        ...formData,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        imageDataUrl: preview || '',
        reportedByUserId: currentUser?.id || null,
      })

      setShowSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        category: 'Other',
        location: '',
        dateFound: today,
        description: ''
      })
      setFile(null)
      setPreview('')
      setErrors({})
      
      // Navigate after delay
      setTimeout(() => {
        navigate(`/items/${created.id}`)
      }, 2000)
    } finally {
      setBusy(false)
    }
  }

  function removeImage() {
    setFile(null)
    setPreview('')
    setErrors(prev => ({ ...prev, image: null }))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white">Report Found Item</div>
        <div className="mt-2 text-slate-400">
          Help reunite lost items with their owners by submitting a detailed report
        </div>
      </div>

      {showSuccess && (
        <SuccessMessage onClose={() => setShowSuccess(false)} />
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Upload */}
        <div className="rounded-3xl border border-slate-800 glass-effect p-6 animate-slide-up">
          <div className="text-lg font-semibold text-white mb-2">Item Photo</div>
          <div className="text-sm text-slate-400 mb-6">
            Upload a clear image to help identify the item (optional but recommended)
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/30">
              <div className="aspect-video">
                {preview ? (
                  <div className="relative h-full">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid h-full w-full place-items-center text-slate-500">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-medium mb-2">Upload an image</div>
                      <div className="text-sm">Drag and drop or click to select</div>
                      <div className="text-xs mt-2 text-slate-600">PNG, JPG up to 5MB</div>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {errors.image && (
              <div className="flex items-center gap-2 text-sm school-red">
                <AlertCircle className="h-4 w-4" />
                {errors.image}
              </div>
            )}
            
            {file && (
              <div className="text-sm text-slate-400">
                Selected: <span className="text-slate-300">{file.name}</span>
                <span className="text-slate-500"> ({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-800 glass-effect p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-lg font-semibold text-white mb-6">Item Details</div>

          <form onSubmit={onSubmit} className="space-y-6">
            <FormField label="Item Title" error={errors.title} required>
              <input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Black iPhone 13 with blue case"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-school-red transition-colors"
              />
            </FormField>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Category" required>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-school-red transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-950">
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField label="Date Found" error={errors.dateFound} required>
                <input
                  value={formData.dateFound}
                  onChange={(e) => updateField('dateFound', e.target.value)}
                  type="date"
                  max={today}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none focus:border-school-red transition-colors"
                />
              </FormField>
            </div>

            <FormField label="Location Found" error={errors.location} required>
              <input
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g., Library - 2nd floor near study tables"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-school-red transition-colors"
              />
            </FormField>

            <FormField label="Description" error={errors.description} required>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                placeholder="Describe the item in detail: color, brand, size, condition, any identifying marks or features..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-school-red transition-colors resize-none"
              />
              <div className="text-xs text-slate-500 mt-1">
                {formData.description.length}/500 characters
              </div>
            </FormField>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl school-gradient px-6 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {busy ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </div>
              ) : (
                'Submit for Review'
              )}
            </button>
            
            <div className="text-xs text-slate-500 text-center">
              Your report will be reviewed by an admin before being published publicly
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

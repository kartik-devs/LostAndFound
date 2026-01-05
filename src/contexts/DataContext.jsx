import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON, uid } from '../lib/storage'

const ITEMS_KEY = 'lf_items'
const CLAIMS_KEY = 'lf_claims'
const REVIEWS_KEY = 'lf_reviews'

const DataContext = createContext(null)

function seedItems(items) {
  if (items.length > 0) return items

  const now = Date.now()
  return [
    {
      id: uid('itm_'),
      title: 'Black Water Bottle (Hydro Flask)',
      category: 'Bottle',
      location: 'Library - 2nd floor',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10),
      description: 'Found near the study tables. Has a small dent at the bottom.',
      imageDataUrl: '',
      status: 'approved',
      createdAt: now - 1000 * 60 * 60 * 24 * 2,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Silver Keychain with 2 keys',
      category: 'Keys',
      location: 'Cafeteria entrance',
      dateFound: new Date(now - 1000 * 60 * 60 * 20).toISOString().slice(0, 10),
      description: 'Keychain has a blue tag. Turned in by staff.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 20,
      reportedByUserId: null,
    },
  ]
}

export function DataProvider({ children }) {
  const [items, setItems] = useState(() => seedItems(loadJSON(ITEMS_KEY, [])))
  const [claims, setClaims] = useState(() => loadJSON(CLAIMS_KEY, []))
  const [reviews, setReviews] = useState(() => loadJSON(REVIEWS_KEY, []))

  useEffect(() => saveJSON(ITEMS_KEY, items), [items])
  useEffect(() => saveJSON(CLAIMS_KEY, claims), [claims])
  useEffect(() => saveJSON(REVIEWS_KEY, reviews), [reviews])

  function addItem(payload) {
    const newItem = {
      id: uid('itm_'),
      title: String(payload.title || '').trim(),
      category: String(payload.category || '').trim() || 'Other',
      location: String(payload.location || '').trim(),
      dateFound: String(payload.dateFound || '').trim(),
      description: String(payload.description || '').trim(),
      imageDataUrl: payload.imageDataUrl || '',
      status: 'pending',
      createdAt: Date.now(),
      reportedByUserId: payload.reportedByUserId || null,
    }

    setItems((prev) => [newItem, ...prev])
    return newItem
  }

  function setItemStatus(itemId, status) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status } : it)))
  }

  function updateItem(itemId, patch) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...patch } : it)))
  }

  function deleteItem(itemId) {
    setItems((prev) => prev.filter((it) => it.id !== itemId))
    setClaims((prev) => prev.filter((c) => c.itemId !== itemId))
  }

  function addClaim(payload) {
    const newClaim = {
      id: uid('clm_'),
      itemId: payload.itemId,
      userId: payload.userId,
      contact: String(payload.contact || '').trim(),
      message: String(payload.message || '').trim(),
      createdAt: Date.now(),
      status: 'submitted',
    }

    setClaims((prev) => [newClaim, ...prev])
    return newClaim
  }

  function updateClaimStatus(claimId, status) {
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, status } : c)))
  }

  function addReview(payload) {
    const newReview = {
      id: uid('rev_'),
      userId: payload.userId,
      rating: Number(payload.rating || 5),
      comment: String(payload.comment || '').trim(),
      createdAt: Date.now(),
    }

    setReviews((prev) => [newReview, ...prev])
    return newReview
  }

  const value = useMemo(
    () => ({
      items,
      setItems,
      claims,
      reviews,
      addItem,
      setItemStatus,
      updateItem,
      deleteItem,
      addClaim,
      updateClaimStatus,
      addReview,
    }),
    [items, claims, reviews],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

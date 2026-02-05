import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON, uid } from '../lib/storage'

const ITEMS_KEY = 'lf_items'
const CLAIMS_KEY = 'lf_claims'
const REVIEWS_KEY = 'lf_reviews'

const DataContext = createContext(null)

function seedClaims(claims, items) {
  if (claims.length > 0) return claims

  const now = Date.now()
  const approvedItems = items.filter(item => item.status === 'approved')
  
  if (approvedItems.length === 0) return []

  return [
    {
      id: uid('clm_'),
      itemId: approvedItems[0]?.id, // Black Water Bottle
      userId: 'user_123',
      contact: 'sarah.johnson@university.edu',
      message: 'This is my water bottle! I lost it yesterday while studying for my midterm. It has my initials "SJ" scratched on the bottom.',
      createdAt: now - 1000 * 60 * 60 * 18,
      status: 'submitted',
    },
    {
      id: uid('clm_'),
      itemId: approvedItems[1]?.id, // iPhone 13 Pro
      userId: 'user_456',
      contact: 'mike.chen@university.edu',
      message: 'I think this might be my phone. I was eating lunch at the food court when I realized it was missing. The blue case matches mine exactly.',
      createdAt: now - 1000 * 60 * 60 * 12,
      status: 'in_review',
    },
    {
      id: uid('clm_'),
      itemId: approvedItems[2]?.id, // Brown Leather Wallet
      userId: 'user_789',
      contact: 'alex.rodriguez@university.edu',
      message: 'This is definitely my wallet! I was at the gym yesterday and must have left it in the locker room. My student ID should be inside.',
      createdAt: now - 1000 * 60 * 60 * 8,
      status: 'resolved',
    },
    {
      id: uid('clm_'),
      itemId: approvedItems[3]?.id, // Red Nike Backpack
      userId: 'user_101',
      contact: 'emma.davis@university.edu',
      message: 'I believe this is my backpack. I had engineering class in room 205 and left it there by accident. It should have my thermodynamics textbook inside.',
      createdAt: now - 1000 * 60 * 60 * 6,
      status: 'submitted',
    },
    {
      id: uid('clm_'),
      itemId: approvedItems[4]?.id, // MacBook Pro
      userId: 'user_202',
      contact: 'james.wilson@university.edu',
      message: 'This looks like my MacBook! I was in study room 3 working on my computer science project. The stickers on the back are from various tech conferences I attended.',
      createdAt: now - 1000 * 60 * 60 * 4,
      status: 'in_review',
    },
  ]
}

function seedItems(items) {
  if (items.length > 0) return items

  const now = Date.now()
  return [
    // Approved items
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
      title: 'iPhone 13 Pro - Blue Case',
      category: 'Electronics',
      location: 'Student Union - Food Court',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString().slice(0, 10),
      description: 'Found on table near Subway. Screen has minor crack. Phone is locked.',
      imageDataUrl: '',
      status: 'approved',
      createdAt: now - 1000 * 60 * 60 * 24 * 1,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Brown Leather Wallet',
      category: 'Wallet',
      location: 'Gym - Locker Room',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
      description: 'Contains student ID and some cash. Found in men\'s locker room.',
      imageDataUrl: '',
      status: 'approved',
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Red Nike Backpack',
      category: 'Bag',
      location: 'Engineering Building - Room 205',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString().slice(0, 10),
      description: 'Contains textbooks and notebooks. Left after class ended.',
      imageDataUrl: '',
      status: 'approved',
      createdAt: now - 1000 * 60 * 60 * 24 * 4,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Silver MacBook Pro 13"',
      category: 'Electronics',
      location: 'Library - Study Room 3',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10),
      description: 'Left in study room with charger. Has stickers on the back.',
      imageDataUrl: '',
      status: 'approved',
      createdAt: now - 1000 * 60 * 60 * 24 * 5,
      reportedByUserId: null,
    },

    // Pending items
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
    {
      id: uid('itm_'),
      title: 'AirPods Pro (2nd Gen)',
      category: 'Electronics',
      location: 'Business Building - Lecture Hall B',
      dateFound: new Date(now - 1000 * 60 * 60 * 12).toISOString().slice(0, 10),
      description: 'Found under seat after economics class. Case is slightly scratched.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 12,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Blue Adidas Water Bottle',
      category: 'Bottle',
      location: 'Recreation Center - Basketball Court',
      dateFound: new Date(now - 1000 * 60 * 60 * 8).toISOString().slice(0, 10),
      description: 'Left on bleachers after intramural game. Half full.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 8,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Gold Ring with Small Diamond',
      category: 'Jewelry',
      location: 'Chemistry Lab - Room 101',
      dateFound: new Date(now - 1000 * 60 * 60 * 6).toISOString().slice(0, 10),
      description: 'Found near sink area. Appears to be an engagement ring.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 6,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Black Jansport Backpack',
      category: 'Bag',
      location: 'Parking Lot C',
      dateFound: new Date(now - 1000 * 60 * 60 * 4).toISOString().slice(0, 10),
      description: 'Found near bike racks. Contains laptop and school supplies.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 4,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Prescription Glasses - Black Frames',
      category: 'Accessories',
      location: 'Math Building - Room 302',
      dateFound: new Date(now - 1000 * 60 * 60 * 2).toISOString().slice(0, 10),
      description: 'Left on desk after calculus exam. Progressive lenses.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 2,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Samsung Galaxy Watch',
      category: 'Electronics',
      location: 'Fitness Center - Treadmill Area',
      dateFound: new Date(now - 1000 * 60 * 60 * 1).toISOString().slice(0, 10),
      description: 'Black sport band. Found on equipment after workout session.',
      imageDataUrl: '',
      status: 'pending',
      createdAt: now - 1000 * 60 * 60 * 1,
      reportedByUserId: null,
    },

    // Some rejected items for completeness
    {
      id: uid('itm_'),
      title: 'Old Textbook - Biology 101',
      category: 'Books',
      location: 'Library - Return Desk',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
      description: 'Very worn textbook, appears to be abandoned.',
      imageDataUrl: '',
      status: 'rejected',
      createdAt: now - 1000 * 60 * 60 * 24 * 7,
      reportedByUserId: null,
    },
    {
      id: uid('itm_'),
      title: 'Broken Umbrella',
      category: 'Other',
      location: 'Main Entrance',
      dateFound: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString().slice(0, 10),
      description: 'Umbrella with broken ribs, not repairable.',
      imageDataUrl: '',
      status: 'rejected',
      createdAt: now - 1000 * 60 * 60 * 24 * 6,
      reportedByUserId: null,
    },
  ]
}

export function DataProvider({ children }) {
  const [items, setItems] = useState(() => seedItems(loadJSON(ITEMS_KEY, [])))
  const [claims, setClaims] = useState(() => seedClaims(loadJSON(CLAIMS_KEY, []), items))
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

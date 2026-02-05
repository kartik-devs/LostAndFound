import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  TrendingUp,
  Calendar,
  MapPin,
  Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import ItemCard from '../components/ItemCard'
import { StatCardSkeleton } from '../components/LoadingSkeleton'

function ActivityItem({ icon: Icon, title, description, time, status, onClick }) {
  const statusColors = {
    success: 'text-green-400 bg-green-500/10',
    pending: 'text-amber-400 bg-amber-500/10',
    error: 'text-red-400 bg-red-500/10',
    info: 'text-blue-400 bg-blue-500/10'
  }

  return (
    <div 
      className="flex items-start gap-4 p-4 rounded-xl border border-slate-800/50 bg-slate-900/40 hover:bg-slate-800/40 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className={`p-2 rounded-lg ${statusColors[status] || statusColors.info}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-sm">{title}</div>
        <div className="text-slate-400 text-sm mt-1">{description}</div>
        <div className="text-slate-500 text-xs mt-2">{time}</div>
      </div>
    </div>
  )
}

function QuickStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Items Reported</div>
            <div className="text-2xl font-bold text-white">{stats.reported}</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Claims Made</div>
            <div className="text-2xl font-bold text-white">{stats.claims}</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Pending</div>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Star className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Success Rate</div>
            <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const { items, claims } = useData()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')

  const userStats = useMemo(() => {
    const userItems = items.filter(item => item.reportedByUserId === currentUser?.id)
    const userClaims = claims.filter(claim => claim.userId === currentUser?.id)
    
    const reported = userItems.length
    const claimsCount = userClaims.length
    const pending = userItems.filter(item => item.status === 'pending').length
    const approved = userItems.filter(item => item.status === 'approved').length
    const successRate = reported > 0 ? Math.round((approved / reported) * 100) : 0

    return { reported, claims: claimsCount, pending, successRate }
  }, [items, claims, currentUser])

  const recentActivity = useMemo(() => {
    const userItems = items.filter(item => item.reportedByUserId === currentUser?.id)
    const userClaims = claims.filter(claim => claim.userId === currentUser?.id)
    
    const activities = [
      ...userItems.map(item => ({
        id: `item-${item.id}`,
        icon: Package,
        title: `Reported: ${item.title}`,
        description: `Found at ${item.location}`,
        time: new Date(item.createdAt).toLocaleDateString(),
        status: item.status === 'approved' ? 'success' : item.status === 'pending' ? 'pending' : 'error',
        onClick: () => window.location.href = `/items/${item.id}`
      })),
      ...userClaims.map(claim => ({
        id: `claim-${claim.id}`,
        icon: MessageSquare,
        title: `Claimed: ${claim.itemTitle}`,
        description: claim.message,
        time: new Date(claim.createdAt).toLocaleDateString(),
        status: claim.status === 'approved' ? 'success' : 'pending',
        onClick: () => window.location.href = `/items/${claim.itemId}`
      }))
    ]

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10)
  }, [items, claims, currentUser])

  const myItems = useMemo(() => {
    return items
      .filter(item => item.reportedByUserId === currentUser?.id)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [items, currentUser])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your reported items and claims</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
        >
          <Package className="h-4 w-4" />
          Report Found Item
        </Link>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={userStats} />

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'items', label: 'My Items' },
            { id: 'activity', label: 'Recent Activity' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-school-red text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map(activity => (
                  <ActivityItem key={activity.id} {...activity} />
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity yet. Start by reporting a found item!</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/report"
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 transition-all"
              >
                <Package className="h-5 w-5 text-blue-400" />
                <span className="text-white">Report Found Item</span>
              </Link>
              <Link
                to="/items"
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 transition-all"
              >
                <Eye className="h-5 w-5 text-green-400" />
                <span className="text-white">Browse Items</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 transition-all"
              >
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <span className="text-white">Update Profile</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">My Reported Items</h2>
          {myItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-semibold text-white mb-2">No items reported yet</h3>
              <p className="text-slate-400 mb-6">Start helping your campus community by reporting found items</p>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
              >
                <Package className="h-4 w-4" />
                Report Your First Item
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">All Activity</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <ActivityItem key={activity.id} {...activity} />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
                <p className="text-slate-400">Your activity will appear here as you use the platform</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
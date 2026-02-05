import { useMemo } from 'react'
import { BarChart3, TrendingUp, MapPin, Clock, Users, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { useData } from '../contexts/DataContext'

function StatCard({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
  
  return (
    <div className={`rounded-2xl border p-6 glass-effect ${colorClasses[color]} animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-800/50 p-3">
            <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[0]}`} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400">{title}</div>
            <div className="mt-1 text-3xl font-bold text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  )
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-800 glass-effect p-6 animate-slide-up ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}

function BarChart({ data, maxValue }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-20 text-sm text-slate-400 truncate">{item.label}</div>
          <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-8 text-sm font-semibold text-white text-right">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { items, claims } = useData()

  const analytics = useMemo(() => {
    const now = Date.now()
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000)

    // Basic stats
    const totalItems = items.length
    const approvedItems = items.filter(i => i.status === 'approved').length
    const pendingItems = items.filter(i => i.status === 'pending').length
    const rejectedItems = items.filter(i => i.status === 'rejected').length
    const totalClaims = claims.length
    const resolvedClaims = claims.filter(c => c.status === 'resolved').length

    // Trends (comparing last week to previous week)
    const thisWeekItems = items.filter(i => i.createdAt > oneWeekAgo).length
    const lastWeekItems = items.filter(i => i.createdAt > (oneWeekAgo - 7 * 24 * 60 * 60 * 1000) && i.createdAt <= oneWeekAgo).length
    const itemsTrend = lastWeekItems > 0 ? Math.round(((thisWeekItems - lastWeekItems) / lastWeekItems) * 100) : 0

    // Category breakdown
    const categoryStats = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    const categoryData = Object.entries(categoryStats)
      .map(([category, count]) => ({ label: category, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    // Location breakdown
    const locationStats = items.reduce((acc, item) => {
      const location = item.location.split(' - ')[0] || item.location
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {})

    const locationData = Object.entries(locationStats)
      .map(([location, count]) => ({ label: location, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Status breakdown
    const statusData = [
      { label: 'Approved', value: approvedItems },
      { label: 'Pending', value: pendingItems },
      { label: 'Rejected', value: rejectedItems }
    ]

    // Recent activity (last 7 days)
    const recentItems = items.filter(i => i.createdAt > oneWeekAgo).length
    const recentClaims = claims.filter(c => c.createdAt > oneWeekAgo).length

    // Success rate
    const successRate = totalClaims > 0 ? Math.round((resolvedClaims / totalClaims) * 100) : 0

    // Average response time (simulated)
    const avgResponseTime = '2.3 hours'

    return {
      totalItems,
      approvedItems,
      pendingItems,
      rejectedItems,
      totalClaims,
      resolvedClaims,
      itemsTrend,
      categoryData,
      locationData,
      statusData,
      recentItems,
      recentClaims,
      successRate,
      avgResponseTime
    }
  }, [items, claims])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-3xl font-bold text-white">Analytics Dashboard</div>
          <div className="mt-2 text-slate-400">
            Comprehensive insights into lost and found operations
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 glass-effect px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800/60">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          title="Total Items"
          value={analytics.totalItems}
          subtitle="All time"
          trend={analytics.itemsTrend}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Success Rate"
          value={`${analytics.successRate}%`}
          subtitle="Claims resolved"
          trend={5}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Avg Response"
          value={analytics.avgResponseTime}
          subtitle="To claims"
          trend={-12}
          color="purple"
        />
        <StatCard
          icon={Users}
          title="Active Claims"
          value={analytics.totalClaims - analytics.resolvedClaims}
          subtitle="Pending review"
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <ChartCard title="Items by Category">
          <BarChart 
            data={analytics.categoryData} 
            maxValue={Math.max(...analytics.categoryData.map(d => d.value))}
          />
        </ChartCard>

        {/* Location Breakdown */}
        <ChartCard title="Items by Location">
          <BarChart 
            data={analytics.locationData} 
            maxValue={Math.max(...analytics.locationData.map(d => d.value))}
          />
        </ChartCard>

        {/* Status Overview */}
        <ChartCard title="Item Status Distribution">
          <div className="space-y-4">
            {analytics.statusData.map((item, index) => {
              const colors = ['text-green-400 bg-green-500/20', 'text-yellow-400 bg-yellow-500/20', 'text-red-400 bg-red-500/20']
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                    <span className="text-slate-200">{item.label}</span>
                  </div>
                  <div className="text-white font-semibold">{item.value}</div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Recent Activity (7 Days)">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-slate-200">New Items Reported</span>
              </div>
              <div className="text-white font-semibold">{analytics.recentItems}</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-slate-200">New Claims Filed</span>
              </div>
              <div className="text-white font-semibold">{analytics.recentClaims}</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-400" />
                <span className="text-slate-200">Items Returned</span>
              </div>
              <div className="text-white font-semibold">{analytics.resolvedClaims}</div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Performance Insights */}
      <ChartCard title="Performance Insights" className="lg:col-span-2">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <div className="text-2xl font-bold text-green-400">{analytics.approvedItems}</div>
            <div className="text-sm text-slate-400 mt-1">Items Successfully Listed</div>
            <div className="text-xs text-green-300 mt-2">
              {analytics.totalItems > 0 ? Math.round((analytics.approvedItems / analytics.totalItems) * 100) : 0}% approval rate
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <div className="text-2xl font-bold text-blue-400">{analytics.pendingItems}</div>
            <div className="text-sm text-slate-400 mt-1">Awaiting Review</div>
            <div className="text-xs text-blue-300 mt-2">
              Average review time: 4.2 hours
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30">
            <div className="text-2xl font-bold text-purple-400">{analytics.resolvedClaims}</div>
            <div className="text-sm text-slate-400 mt-1">Happy Reunions</div>
            <div className="text-xs text-purple-300 mt-2">
              Items successfully returned to owners
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
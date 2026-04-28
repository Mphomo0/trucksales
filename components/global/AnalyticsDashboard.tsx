/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsData {
  totalUsers: number
  totalPageviews: number
  totalEvents: number
  bounceRate: number
  pageviewsOverTime: Array<{ date: string; pageviews: number }>
  topPages: Array<{ page: string; views: number }>
  topEvents: Array<{ event: string; count: number }>
  deviceTypes: Array<{ device: string; count: number; percentage: number }>
  userGrowth: number
  avgSessionDuration: number
}

const COLORS = ['#f5b800', '#00C49F', '#0088FE', '#FF8042', '#8884D8']

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('7d')

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/analytics?range=${dateRange}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="dash-stat-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dash-stat-card animate-pulse">
              <div className="dash-stat-icon-wrap bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded w-24 mt-4" />
              <div className="h-8 bg-gray-100 rounded w-16 mt-2" />
            </div>
          ))}
        </div>
        <div className="dash-card h-[400px] flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-dash-accent" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="dash-card h-[400px] flex flex-col items-center justify-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={fetchAnalytics}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-dash-card-border">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-dash-text-muted" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 border-none bg-transparent hover:bg-gray-50 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchAnalytics} variant="ghost" size="sm" className="text-dash-text-muted hover:text-dash-accent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="dash-stat-grid">
        <div className="dash-stat-card">
          <div className="flex items-center justify-between">
            <div className="dash-stat-icon-wrap bg-blue-50 text-blue-600">
              <Users size={20} />
            </div>
            <div className={`dash-stat-trend ${data.userGrowth >= 0 ? 'up' : 'down'}`}>
              {data.userGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(data.userGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="dash-stat-label">Total Users</p>
          <p className="dash-stat-value">{data.totalUsers.toLocaleString()}</p>
        </div>

        <div className="dash-stat-card">
          <div className="flex items-center justify-between">
            <div className="dash-stat-icon-wrap bg-green-50 text-green-600">
              <Eye size={20} />
            </div>
            <div className="dash-stat-trend up">
              <ArrowUpRight size={14} />
              Live
            </div>
          </div>
          <p className="dash-stat-label">Page Views</p>
          <p className="dash-stat-value">{data.totalPageviews.toLocaleString()}</p>
        </div>

        <div className="dash-stat-card">
          <div className="flex items-center justify-between">
            <div className="dash-stat-icon-wrap bg-purple-50 text-purple-600">
              <MousePointer size={20} />
            </div>
          </div>
          <p className="dash-stat-label">Total Events</p>
          <p className="dash-stat-value">{data.totalEvents.toLocaleString()}</p>
        </div>

        <div className="dash-stat-card">
          <div className="flex items-center justify-between">
            <div className="dash-stat-icon-wrap bg-orange-50 text-orange-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="dash-stat-label">Avg. Session</p>
          <p className="dash-stat-value">{Math.round(data.avgSessionDuration / 60)}m</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dash-card">
          <h2 className="dash-card-title">Page Views Over Time</h2>
          <p className="dash-card-desc">Monitoring daily traffic fluctuations</p>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.pageviewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [value?.toLocaleString() ?? '0', 'Page Views']}
                />
                <Line
                  type="monotone"
                  dataKey="pageviews"
                  stroke="#f5b800"
                  strokeWidth={3}
                  dot={{ fill: '#f5b800', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="dash-card-title">Device Distribution</h2>
          <p className="dash-card-desc">How users access your site</p>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.deviceTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.deviceTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [value?.toLocaleString() ?? '0', 'Users']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {data.deviceTypes.map((device, index) => (
              <div key={device.device} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-dash-text-muted capitalize">{device.device}</span>
                <span className="text-xs font-bold">{device.percentage.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dash-card">
          <h2 className="dash-card-title">Most Visited Pages</h2>
          <p className="dash-card-desc">Top performing content by view count</p>
          <div className="space-y-4 mt-6">
            {data.topPages.slice(0, 5).map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-dash-accent/40">0{index + 1}</span>
                  <span className="text-sm font-semibold truncate max-w-[200px]">{page.page}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className="h-full bg-dash-accent" 
                      style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-dash-text-muted">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <h2 className="dash-card-title">User Engagement (Events)</h2>
          <p className="dash-card-desc">Tracking key interactions on site</p>
          <div className="h-[280px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topEvents.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="event" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#888' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [value?.toLocaleString() ?? '0', 'Count']}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

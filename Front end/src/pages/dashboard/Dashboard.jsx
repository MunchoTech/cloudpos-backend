import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingCart, Package, AlertTriangle, ArrowRight, Plus, Eye, Clock } from 'lucide-react'
import { reportService }  from '../../services/reportService'
import { salesService }   from '../../services/salesService'
import { productService } from '../../services/productService'
import { useAuth }        from '../../context/AuthContext'
import { formatKwacha, formatDateTime } from '../../utils/format'
import { USE_MOCK } from '../../hooks/useApi'
import { mockSummary, mockToday, mockLowStock, mockSales } from '../../data/mockData'
import toast from 'react-hot-toast'

const METHOD_COLORS = {
  CASH:         { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e' },
  CARD:         { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  MOBILE_MONEY: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [summary,     setSummary]  = useState(USE_MOCK ? mockSummary  : null)
  const [today,       setToday]    = useState(USE_MOCK ? mockToday    : null)
  const [lowStock,    setLow]      = useState(USE_MOCK ? mockLowStock : [])
  const [recentSales, setRecent]   = useState(USE_MOCK ? mockSales    : [])
  const [loading,     setLoading]  = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    const load = async () => {
      setLoading(true)
      try {
        const [s, t, l, sa] = await Promise.all([
          reportService.getSummary(),
          salesService.getToday(),
          productService.getLowStock(),
          salesService.getAll(),
        ])
        setSummary(s.data)
        setToday(t.data)
        setLow(l.data?.slice(0, 5) || [])
        setRecent((sa.data || []).slice(0, 5))
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: "Today's Revenue",  value: formatKwacha(today?.totalRevenue || 0),          sub: `${today?.totalSales || 0} transactions today`, color: '#00D4AA', bg: 'rgba(0,212,170,0.08)',  icon: TrendingUp  },
    { label: 'Total Sales',      value: (summary?.totalSales || 0).toLocaleString(),      sub: 'All-time transactions',                         color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: ShoppingCart },
    { label: 'Products',         value: summary?.totalProducts || 0,                      sub: 'Items in catalogue',                            color: '#a855f7', bg: 'rgba(168,85,247,0.08)', icon: Package      },
    { label: 'Low Stock Alerts', value: lowStock.length,                                  sub: 'Items need restocking',                         color: '#f97316', bg: 'rgba(249,115,22,0.08)', icon: AlertTriangle},
  ]

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl p-4 h-28 animate-pulse" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bright">{greeting}, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="text-light text-sm mt-1">{user?.businessName} &nbsp;·&nbsp; Here's what's happening today</p>
        </div>
        <Link to="/pos" className="btn-primary w-auto px-5 py-2.5">
          <Plus size={15} /> New Sale
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, color, bg, icon: Icon }) => (
          <div key={label} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
            <div className="flex items-center justify-between">
              <p className="text-light text-xs font-medium">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-bright">{value}</p>
            <p className="text-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 rounded-xl" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-bright font-semibold">Recent Activity</h2>
            <Link to="/sales" className="text-primary text-xs hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {recentSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock size={32} className="text-border mb-3" />
              <p className="text-muted text-sm">No sales yet today</p>
            </div>
          ) : recentSales.map((s, i) => {
            const mc = METHOD_COLORS[s.paymentMethod] || METHOD_COLORS.CASH
            return (
              <div key={s.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-surface/50 transition-colors ${i < recentSales.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,170,0.08)' }}>
                  <ShoppingCart size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-bright text-sm font-medium truncate">{s.receiptNumber}</p>
                  <p className="text-muted text-xs">{formatDateTime(s.saleDate)}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: mc.bg, color: mc.text }}>
                  {s.paymentMethod?.replace('_', ' ')}
                </span>
                <p className="text-primary font-bold text-sm flex-shrink-0">{formatKwacha(s.total)}</p>
                <Link to={`/sales/${s.id}`} className="text-muted hover:text-primary transition-colors flex-shrink-0"><Eye size={14} /></Link>
              </div>
            )
          })}
        </div>

        {/* Low Stock */}
        <div className="rounded-xl" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-bright font-semibold">Low Stock</h2>
            <Link to="/inventory" className="text-primary text-xs hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package size={32} className="text-border mb-3" />
              <p className="text-muted text-sm">All stock healthy</p>
            </div>
          ) : lowStock.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between px-5 py-3.5 ${i < lowStock.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="min-w-0">
                <p className="text-bright text-sm font-medium truncate">{p.name}</p>
                <p className="text-muted text-xs">{p.categoryName}</p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <span className="text-sm font-bold" style={{ color: p.stockQuantity <= 3 ? '#f97316' : '#eab308' }}>{p.stockQuantity}</span>
                <p className="text-muted text-xs">left</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'New Sale',     to: '/pos',           color: '#00D4AA' },
          { label: 'Add Product',  to: '/inventory/new', color: '#3b82f6' },
          { label: 'View Reports', to: '/reports',       color: '#a855f7' },
          { label: 'Manage Stock', to: '/inventory',     color: '#f97316' },
        ].map(({ label, to, color }) => (
          <Link key={to} to={to} className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: '#0B1E30', border: `1px solid ${color}25` }}>
            <span className="text-bright text-sm font-medium">{label}</span>
            <ArrowRight size={14} style={{ color }} />
          </Link>
        ))}
      </div>
    </div>
  )
}

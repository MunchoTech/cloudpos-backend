import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Eye } from 'lucide-react'
import { salesService } from '../../services/salesService'
import { formatKwacha, formatDateTime } from '../../utils/format'
import { USE_MOCK } from '../../hooks/useApi'
import { mockSales, mockToday } from '../../data/mockData'
import toast from 'react-hot-toast'

const METHOD = {
  CASH:         { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', label: 'Cash' },
  CARD:         { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', label: 'Card' },
  MOBILE_MONEY: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7', label: 'Mobile Money' },
}

export default function Sales() {
  const [sales,   setSales]  = useState(USE_MOCK ? mockSales  : [])
  const [today,   setToday]  = useState(USE_MOCK ? mockToday  : null)
  const [loading, setLoad]   = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    setLoad(true)
    Promise.all([salesService.getAll(), salesService.getToday()])
      .then(([a, t]) => { setSales(a.data || []); setToday(t.data) })
      .catch(() => toast.error('Failed to load sales'))
      .finally(() => setLoad(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bright">Sales History</h1>
        <p className="text-light text-sm mt-1">{sales.length} total transactions</p>
      </div>

      {today && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today's Revenue",  value: formatKwacha(today.totalRevenue),       color: '#00D4AA' },
            { label: 'Transactions',      value: today.totalSales,                       color: '#3b82f6' },
            { label: 'Avg. Order Value',  value: formatKwacha(today.averageOrderValue),  color: '#a855f7' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl px-5 py-4" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
              <p className="text-muted text-xs mb-2">{label}</p>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <p className="flex-1 text-xs font-semibold text-muted uppercase tracking-widest">Receipt No.</p>
          <p className="w-40 text-xs font-semibold text-muted uppercase tracking-widest">Date & Time</p>
          <p className="w-28 text-xs font-semibold text-muted uppercase tracking-widest">Method</p>
          <p className="w-28 text-xs font-semibold text-muted uppercase tracking-widest text-right">Amount</p>
          <div className="w-8" />
        </div>

        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 animate-pulse">
              <div className="flex-1 h-4 bg-border rounded" /><div className="w-40 h-4 bg-border rounded" />
              <div className="w-28 h-4 bg-border rounded" /><div className="w-28 h-4 bg-border rounded" />
            </div>
          ))
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp size={40} className="text-border mb-3" />
            <p className="text-muted">No sales yet</p>
            <Link to="/pos" className="text-primary text-sm hover:underline mt-2">Make your first sale →</Link>
          </div>
        ) : sales.map((s, i) => {
          const m = METHOD[s.paymentMethod] || METHOD.CASH
          return (
            <div key={s.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-surface/50 transition-colors ${i < sales.length - 1 ? 'border-b border-border/50' : ''}`}>
              <p className="flex-1 text-bright text-sm font-mono">{s.receiptNumber}</p>
              <p className="w-40 text-light text-xs">{formatDateTime(s.saleDate)}</p>
              <div className="w-28"><span className="badge" style={{ background: m.bg, color: m.text }}>{m.label}</span></div>
              <p className="w-28 text-primary font-bold text-sm text-right">{formatKwacha(s.total)}</p>
              <Link to={`/sales/${s.id}`}
                className="w-8 h-8 rounded-lg border border-border hover:border-primary hover:text-primary text-muted flex items-center justify-center transition-all">
                <Eye size={13} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

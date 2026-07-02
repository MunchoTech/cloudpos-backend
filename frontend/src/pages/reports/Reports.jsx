import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { reportService } from '../../services/reportService'
import { formatKwacha, todayISO } from '../../utils/format'
import { USE_MOCK } from '../../hooks/useApi'
import { mockDailyReport } from '../../data/mockData'
import toast from 'react-hot-toast'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
      <p className="text-muted mb-1">{label}</p>
      <p className="text-primary font-bold">{formatKwacha(payload[0].value)}</p>
    </div>
  )
}

export default function Reports() {
  const [daily,   setDaily]  = useState(USE_MOCK ? mockDailyReport : null)
  const [date,    setDate]   = useState(todayISO())
  const [loading, setLoad]   = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    setLoad(true)
    reportService.getDaily(date)
      .then(r => setDaily(r.data))
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoad(false))
  }, [date])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-bright">Reports Dashboard</h1>
          <p className="text-light text-sm mt-1">Business performance analytics</p>
        </div>
        <input type="date" className="input-field w-auto" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Daily Revenue',   value: formatKwacha(daily?.totalRevenue),       color: '#00D4AA' },
          { label: 'Transactions',    value: daily?.totalSales ?? '—',                color: '#3b82f6' },
          { label: 'Avg Order Value', value: formatKwacha(daily?.averageOrderValue),   color: '#a855f7' },
          { label: 'Top Product',     value: daily?.topProducts?.[0]?.productName?.split(' ')[0] || '—', color: '#f97316' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-5 py-4" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
            <p className="text-muted text-xs mb-2">{label}</p>
            <p className="text-xl font-bold text-bright">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl p-5" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          <h2 className="text-bright font-semibold mb-4">Hourly Revenue</h2>
          {loading ? (
            <div className="h-48 animate-pulse rounded-lg" style={{ background: '#1E3A52' }} />
          ) : daily?.hourlyBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={daily.hourlyBreakdown} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A52" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#4A6B85', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A6B85', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `K${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#00D4AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted text-sm">No data for this date</div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          <h2 className="text-bright font-semibold mb-4">Top Products</h2>
          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-8 animate-pulse rounded" style={{ background: '#1E3A52' }} />)}</div>
          ) : daily?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {daily.topProducts.map((p, i) => {
                const max = daily.topProducts[0]?.quantity || 1
                return (
                  <div key={p.productId || i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-light font-medium truncate pr-2">{p.productName}</span>
                      <span className="text-primary font-bold flex-shrink-0">{p.quantity} sold</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1E3A52' }}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((p.quantity / max) * 100)}%`, opacity: i === 0 ? 1 : 0.6 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted text-sm">No data</div>
          )}
        </div>
      </div>
    </div>
  )
}

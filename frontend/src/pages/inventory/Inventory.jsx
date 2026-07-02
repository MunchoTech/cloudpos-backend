import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react'
import { productService } from '../../services/productService'
import { formatKwacha } from '../../utils/format'
import { USE_MOCK } from '../../hooks/useApi'
import { mockProducts } from '../../data/mockData'
import toast from 'react-hot-toast'

function StockBadge({ qty }) {
  if (qty === 0)  return <span className="badge" style={{ background: 'rgba(239,68,68,0.12)',  color: '#ef4444' }}>Out of stock</span>
  if (qty <= 5)   return <span className="badge" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>{qty} left — low</span>
  if (qty <= 20)  return <span className="badge" style={{ background: 'rgba(234,179,8,0.12)',  color: '#eab308' }}>{qty} in stock</span>
  return <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: '#00D4AA' }}>{qty} in stock</span>
}

export default function Inventory() {
  const [products, setProducts] = useState(USE_MOCK ? mockProducts : [])
  const [query,    setQuery]    = useState('')
  const [filter,   setFilter]   = useState('all')
  const [loading,  setLoading]  = useState(!USE_MOCK)

  const load = async () => {
    if (USE_MOCK) return
    setLoading(true)
    try {
      const res = filter === 'low-stock'
        ? await productService.getLowStock()
        : await productService.getAll()
      setProducts(res.data || [])
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  const handleSearch = async (e) => {
    const q = e.target.value
    setQuery(q)
    if (USE_MOCK || !q) return
    try {
      const res = await productService.search(q)
      setProducts(res.data || [])
    } catch {}
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    if (USE_MOCK) {
      setProducts(p => p.filter(x => x.id !== id))
      toast.success(`${name} deleted`)
      return
    }
    try {
      await productService.remove(id)
      toast.success(`${name} deleted`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bright">Inventory</h1>
          <p className="text-light text-sm mt-1">{filtered.length} products in catalogue</p>
        </div>
        <Link to="/inventory/new" className="btn-primary w-auto px-5 py-2.5"><Plus size={15} /> Add Product</Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input-field pl-10" placeholder="Search products…" value={query} onChange={handleSearch} />
        </div>
        <button onClick={() => setFilter(f => f === 'all' ? 'low-stock' : 'all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
            ${filter === 'low-stock' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : 'border-border text-muted hover:border-primary hover:text-primary'}`}>
          <AlertTriangle size={14} /> Low Stock
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="w-10 flex-shrink-0" />
          <p className="flex-1 text-xs font-semibold text-muted uppercase tracking-widest">Product</p>
          <p className="w-28 text-xs font-semibold text-muted uppercase tracking-widest">Category</p>
          <p className="w-20 text-xs font-semibold text-muted uppercase tracking-widest text-right">Price</p>
          <p className="w-32 text-xs font-semibold text-muted uppercase tracking-widest">Stock</p>
          <p className="w-16 text-xs font-semibold text-muted uppercase tracking-widest">SKU</p>
          <div className="w-16 flex-shrink-0" />
        </div>

        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-border flex-shrink-0" />
              <div className="flex-1 h-4 bg-border rounded" />
              <div className="w-28 h-4 bg-border rounded" />
              <div className="w-20 h-4 bg-border rounded" />
              <div className="w-32 h-4 bg-border rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-border mb-3" />
            <p className="text-muted font-medium">No products found</p>
            <Link to="/inventory/new" className="text-primary text-sm hover:underline mt-2">Add your first product →</Link>
          </div>
        ) : filtered.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-surface/50 transition-colors ${i < filtered.length - 1 ? 'border-b border-border/50' : ''}`}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)' }}>
              <Package size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-bright text-sm font-medium truncate">{p.name}</p>
            </div>
            <p className="w-28 text-light text-sm truncate">{p.categoryName}</p>
            <p className="w-20 text-primary text-sm font-semibold text-right">{formatKwacha(p.price)}</p>
            <div className="w-32"><StockBadge qty={p.stockQuantity} /></div>
            <p className="w-16 text-muted text-xs font-mono truncate">{p.sku}</p>
            <div className="flex gap-1.5 w-16 justify-end flex-shrink-0">
              <Link to={`/inventory/${p.id}/edit`}
                className="w-8 h-8 rounded-lg border border-border hover:border-primary hover:text-primary text-muted flex items-center justify-center transition-all">
                <Edit size={13} />
              </Link>
              <button onClick={() => handleDelete(p.id, p.name)}
                className="w-8 h-8 rounded-lg border border-border hover:border-red-400 hover:text-red-400 text-muted flex items-center justify-center transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

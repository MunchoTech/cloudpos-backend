import { useEffect, useState } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle, Package } from 'lucide-react'
import { productService } from '../../services/productService'
import { salesService }   from '../../services/salesService'
import { useCart }        from '../../context/CartContext'
import { formatKwacha, PAYMENT_METHODS } from '../../utils/format'
import { USE_MOCK } from '../../hooks/useApi'
import { mockProducts } from '../../data/mockData'
import toast from 'react-hot-toast'

const METHOD_ICONS  = { CASH: Banknote, CARD: CreditCard, MOBILE_MONEY: Smartphone }
const METHOD_LABELS = { CASH: 'Cash', CARD: 'Card', MOBILE_MONEY: 'Mobile Money' }

function ReceiptModal({ sale, onDone }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,21,32,0.9)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-5" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,170,0.12)', border: '2px solid rgba(0,212,170,0.3)' }}>
            <CheckCircle size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-bright">Sale Complete!</h2>
            <p className="text-muted text-xs mt-1 font-mono">{sale.receiptNumber}</p>
          </div>
        </div>
        <div className="rounded-xl p-4 space-y-2.5" style={{ background: '#041520' }}>
          {sale.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-light">{item.productName} <span className="text-muted">×{item.quantity}</span></span>
              <span className="text-bright font-medium">{formatKwacha(item.subtotal)}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between font-bold">
            <span className="text-bright">Total</span>
            <span className="text-primary text-lg">{formatKwacha(sale.total)}</span>
          </div>
          <p className="text-xs text-muted text-center pt-1">Payment: {sale.paymentMethod?.replace('_', ' ')}</p>
        </div>
        <button onClick={onDone} className="btn-primary">Start New Sale</button>
      </div>
    </div>
  )
}

export default function POS() {
  const { items, addItem, removeItem, updateQty, clearCart,
          subtotal, total, discountAmount, taxAmount, paymentMethod,
          setDiscount, setTax, setPayment, salePayload } = useCart()

  const [products,     setProducts]   = useState(USE_MOCK ? mockProducts : [])
  const [query,        setQuery]      = useState('')
  const [loading,      setLoading]    = useState(!USE_MOCK)
  const [checkingOut,  setCheckout]   = useState(false)
  const [receipt,      setReceipt]    = useState(null)
  const [activeCategory, setCat]      = useState('All')

  useEffect(() => {
    if (USE_MOCK) return
    setLoading(true)
    productService.getAll()
      .then(r => setProducts(r.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.categoryName))]
  const filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase())
    const matchC = activeCategory === 'All' || p.categoryName === activeCategory
    return matchQ && matchC && p.stockQuantity > 0
  })

  const handleCheckout = async () => {
    if (!items.length) { toast.error('Add at least one product'); return }
    setCheckout(true)
    if (USE_MOCK) {
      const mockReceipt = {
        receiptNumber: `RCP-${Date.now()}`,
        total, paymentMethod,
        items: items.map(i => ({ productName: i.productName, quantity: i.quantity, subtotal: i.unitPrice * i.quantity }))
      }
      setTimeout(() => { setReceipt(mockReceipt); clearCart(); toast.success('Sale recorded! (demo)'); setCheckout(false) }, 500)
      return
    }
    try {
      const res = await salesService.processSale(salePayload())
      if (res.success) { setReceipt(res.data); clearCart(); toast.success('Sale recorded!') }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sale failed — please try again')
    } finally { setCheckout(false) }
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)] max-w-7xl mx-auto">
      {receipt && <ReceiptModal sale={receipt} onDone={() => setReceipt(null)} />}

      {/* Products panel */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-bright">Point of Sale</h1>
          <p className="text-muted text-sm">{filtered.length} products available</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input-field pl-10" placeholder="Search products by name…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0
                ${activeCategory === c ? 'bg-primary text-dark' : 'border border-border text-muted hover:border-primary hover:text-primary'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => <div key={i} className="rounded-xl h-48 animate-pulse" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Package size={40} className="text-border mb-3" />
              <p className="text-muted">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map(p => (
                <button key={p.id} onClick={() => addItem(p)}
                  className="rounded-xl p-4 text-left transition-all hover:scale-[1.02] hover:border-primary/50 group"
                  style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
                  <div className="w-full h-28 rounded-lg mb-3 flex items-center justify-center"
                    style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.1)' }}>
                    <Package size={28} className="text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-bright text-sm font-medium truncate">{p.name}</p>
                  <p className="text-muted text-xs mt-0.5">{p.stockQuantity} in stock</p>
                  <p className="text-primary font-bold text-base mt-2">{formatKwacha(p.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart panel */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="flex-1 rounded-xl flex flex-col" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              <h2 className="text-bright font-semibold">Cart</h2>
              {items.length > 0 && <span className="w-5 h-5 rounded-full bg-primary text-dark text-xs font-bold flex items-center justify-center">{items.length}</span>}
            </div>
            {items.length > 0 && <button onClick={clearCart} className="text-muted hover:text-red-400 text-xs transition-colors">Clear</button>}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingCart size={32} className="text-border mb-3" />
                <p className="text-muted text-sm">Add products to start</p>
              </div>
            ) : items.map(item => (
              <div key={item.productId} className="rounded-lg p-3 space-y-2" style={{ background: '#041520', border: '1px solid #1E3A52' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-bright text-xs font-medium leading-tight flex-1">{item.productName}</p>
                  <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={12} /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-md border border-border text-muted hover:border-primary hover:text-primary flex items-center justify-center transition-all">
                      <Minus size={10} />
                    </button>
                    <span className="text-bright text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-6 h-6 rounded-md border border-border text-muted hover:border-primary hover:text-primary flex items-center justify-center transition-all disabled:opacity-30">
                      <Plus size={10} />
                    </button>
                  </div>
                  <p className="text-primary text-sm font-bold">{formatKwacha(item.unitPrice * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-4 border-t border-border space-y-3 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Subtotal</span><span className="text-bright">{formatKwacha(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Discount (K)</span>
                <input type="number" min="0" className="w-20 px-2 py-1 rounded-md text-bright text-xs text-right"
                  style={{ background: '#041520', border: '1px solid #1E3A52' }}
                  value={discountAmount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Tax (K)</span>
                <input type="number" min="0" className="w-20 px-2 py-1 rounded-md text-bright text-xs text-right"
                  style={{ background: '#041520', border: '1px solid #1E3A52' }}
                  value={taxAmount} onChange={e => setTax(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-border">
                <span className="text-bright">Total</span>
                <span className="text-primary text-lg">{formatKwacha(total)}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Payment Method</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PAYMENT_METHODS.map(m => {
                  const Icon = METHOD_ICONS[m]
                  const active = paymentMethod === m
                  return (
                    <button key={m} onClick={() => setPayment(m)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs font-medium transition-all"
                      style={{ borderColor: active ? '#00D4AA' : '#1E3A52', background: active ? 'rgba(0,212,170,0.1)' : 'transparent', color: active ? '#00D4AA' : '#4A6B85' }}>
                      <Icon size={14} />{METHOD_LABELS[m]}
                    </button>
                  )
                })}
              </div>
            </div>

            <button onClick={handleCheckout} disabled={checkingOut || !items.length} className="btn-primary disabled:opacity-40">
              {checkingOut
                ? <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                : `Charge ${formatKwacha(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

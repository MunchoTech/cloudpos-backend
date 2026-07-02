import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { productService }  from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import toast from 'react-hot-toast'

export default function ProductForm() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const isEdit       = Boolean(id)
  const [cats, setCats] = useState([])
  const [loading, setLoad] = useState(false)
  const [form, setForm] = useState({
    name: '', price: '', stockQuantity: '', sku: '', categoryId: '',
  })

  useEffect(() => {
    categoryService.getAll().then(r => setCats(r.data || []))
    if (isEdit) {
      productService.getById(id).then(r => {
        const p = r.data
        setForm({ name: p.name, price: p.price, stockQuantity: p.stockQuantity, sku: p.sku, categoryId: p.categoryId })
      }).catch(() => toast.error('Product not found'))
    }
  }, [id])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.categoryId) { toast.error('Please select a category'); return }
    setLoad(true)
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        sku: form.sku,
        categoryId: parseInt(form.categoryId),
      }
      if (isEdit) {
        await productService.update(id, payload)
        toast.success('Product updated')
      } else {
        await productService.create(payload)
        toast.success('Product created')
      }
      navigate('/inventory')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/inventory" className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center text-brand-muted hover:border-brand-teal hover:text-brand-teal transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-brand-light text-xl font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-brand-muted text-sm">{isEdit ? 'Update product details' : 'Add a new product to inventory'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-widest mb-2">Product Name</label>
          <input className="input-field" placeholder="e.g. Wireless Charger"
            value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-widest mb-2">Price (K)</label>
            <input type="number" step="0.01" min="0" className="input-field" placeholder="0.00"
              value={form.price} onChange={e => update('price', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-widest mb-2">Stock Qty</label>
            <input type="number" min="0" className="input-field" placeholder="0"
              value={form.stockQuantity} onChange={e => update('stockQuantity', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-widest mb-2">SKU</label>
          <input className="input-field" placeholder="e.g. CHG-001"
            value={form.sku} onChange={e => update('sku', e.target.value)} />
        </div>

        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-widest mb-2">Category</label>
          <select className="input-field" value={form.categoryId} onChange={e => update('categoryId', e.target.value)} required>
            <option value="">Select category…</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? <span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
            : <><Save size={15} /> {isEdit ? 'Save Changes' : 'Create Product'}</>}
        </button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Tag, Plus, Edit, Trash2, Search } from 'lucide-react'
import { categoryService } from '../../services/categoryService'
import { USE_MOCK } from '../../hooks/useApi'
import { mockCategories } from '../../data/mockData'
import toast from 'react-hot-toast'

function Modal({ cat, onSave, onClose }) {
  const [form, setForm] = useState({ name: cat?.name || '', description: cat?.description || '' })
  const [loading, setLoad] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (USE_MOCK) {
      toast.success(cat?.id ? 'Category updated' : 'Category created')
      onSave()
      return
    }
    setLoad(true)
    try {
      cat?.id ? await categoryService.update(cat.id, form) : await categoryService.create(form)
      toast.success(cat?.id ? 'Category updated' : 'Category created')
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setLoad(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,21,32,0.85)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
        <h2 className="text-bright font-semibold text-lg">{cat?.id ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Name</label>
            <input className="input-field" placeholder="e.g. Electronics" required
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Description</label>
            <textarea className="input-field resize-none h-20" placeholder="Optional description…"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Categories() {
  const [cats,    setCats]   = useState(USE_MOCK ? mockCategories : [])
  const [query,   setQuery]  = useState('')
  const [modal,   setModal]  = useState(null)
  const [loading, setLoad]   = useState(!USE_MOCK)

  const load = async () => {
    if (USE_MOCK) return
    setLoad(true)
    try {
      const res = query ? await categoryService.search(query) : await categoryService.getAll()
      setCats(res.data || [])
    } catch {
      toast.error('Failed to load categories')
    } finally { setLoad(false) }
  }

  useEffect(() => { load() }, [query])

  const handleDelete = async (cat) => {
    if (cat.productCount > 0) { toast.error(`Cannot delete "${cat.name}" — it has ${cat.productCount} products`); return }
    if (!confirm(`Delete "${cat.name}"?`)) return
    if (USE_MOCK) { setCats(c => c.filter(x => x.id !== cat.id)); toast.success('Category deleted'); return }
    try {
      await categoryService.remove(cat.id)
      toast.success('Category deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete category')
    }
  }

  const filtered = cats.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {modal !== null && <Modal cat={modal} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bright">Categories</h1>
          <p className="text-light text-sm mt-1">{filtered.length} categories</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary w-auto px-5 py-2.5"><Plus size={15} /> Add Category</button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input-field pl-10" placeholder="Search categories…" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="space-y-2">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="rounded-xl h-20 animate-pulse" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }} />)
        ) : filtered.length === 0 ? (
          <div className="rounded-xl flex flex-col items-center justify-center py-16 text-center" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
            <Tag size={40} className="text-border mb-3" />
            <p className="text-muted">No categories yet</p>
            <button onClick={() => setModal({})} className="text-primary text-sm hover:underline mt-2">Create your first category →</button>
          </div>
        ) : filtered.map(c => (
          <div key={c.id} className="rounded-xl flex items-center gap-4 px-5 py-4" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)' }}>
              <Tag size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-bright text-sm font-medium">{c.name}</p>
              <p className="text-muted text-xs">{c.description || 'No description'}</p>
            </div>
            <span className="text-muted text-xs flex-shrink-0">{c.productCount} products</span>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setModal(c)}
                className="w-8 h-8 rounded-lg border border-border hover:border-primary hover:text-primary text-muted flex items-center justify-center transition-all">
                <Edit size={13} />
              </button>
              <button onClick={() => handleDelete(c)}
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

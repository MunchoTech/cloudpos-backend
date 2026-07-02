import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Building2, User, Lock, Eye, EyeOff, ArrowRight, Check, ChevronRight } from 'lucide-react'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, key: 'business',  label: 'Business Identity',  icon: Building2, desc: 'Company details & registration' },
  { id: 2, key: 'contact',   label: 'Contact Details',    icon: User,      desc: 'Owner info & email address' },
  { id: 3, key: 'security',  label: 'Security Setup',     icon: Shield,    desc: 'Password & account protection' },
]

const BUSINESS_TYPES = ['General Retail', 'Wholesale', 'Hardware', 'Pharmacy', 'Electronics', 'Supermarket', 'Restaurant', 'Other']

export default function Register() {
  const navigate     = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoad] = useState(false)
  const [showPw, setShow]  = useState(false)
  const [form, setForm] = useState({
    businessName: '', pacrRegNumber: '', businessType: 'General Retail',
    fullName: '', email: '',
    password: '', confirmPassword: '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const nextStep = () => {
    if (step === 1 && (!form.businessName || !form.pacrRegNumber)) { toast.error('Fill in all business details'); return }
    if (step === 2 && (!form.fullName || !form.email)) { toast.error('Fill in your contact details'); return }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoad(true)
    try {
      const res = await authService.register({ fullName: form.fullName, businessName: form.businessName, email: form.email, password: form.password })
      if (res.success) { toast.success('Business registered! Please sign in.'); navigate('/login') }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoad(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#041520' }}>
      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex flex-col w-80 flex-shrink-0 relative"
        style={{ background: 'linear-gradient(180deg, #041520 0%, #062030 100%)', borderRight: '1px solid #1E3A52' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,170,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <Shield size={18} className="text-primary" />
            </div>
            <span className="text-lg font-bold text-primary">CloudPOS</span>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-bright mb-2">Registration Flow</h2>
            <p className="text-light text-sm">Business Onboarding</p>
          </div>

          {/* Step list */}
          <div className="space-y-1 flex-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done    = step > s.id
              const current = step === s.id
              return (
                <div key={s.id}>
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${current ? 'bg-primary/10 border border-primary/20' : ''}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                      ${done    ? 'bg-primary text-dark' :
                        current ? 'border-2 border-primary text-primary bg-primary/10' :
                                  'border border-border text-muted'}`}>
                      {done ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${current ? 'text-primary' : done ? 'text-bright' : 'text-muted'}`}>{s.label}</p>
                      <p className="text-xs text-muted mt-0.5">{s.desc}</p>
                    </div>
                    {current && <ChevronRight size={14} className="text-primary ml-auto" />}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="ml-[38px] flex items-center gap-2 py-1">
                      <div className={`w-px h-6 mx-4 ${done ? 'bg-primary/40' : 'bg-border'}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="text-muted text-xs mt-auto">© 2024 AfriTrade POS</p>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12" style={{ background: '#051825' }}>
        {/* Mobile step indicator */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${step > s.id ? 'bg-primary text-dark' : step === s.id ? 'border-2 border-primary text-primary' : 'border border-border text-muted'}`}>
                {step > s.id ? <Check size={12} /> : s.id}
              </div>
              {i < STEPS.length - 1 && <div className={`w-10 h-px ${step > s.id ? 'bg-primary/40' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Step {step} of 3</p>
            <h2 className="text-2xl font-bold text-bright">{STEPS[step-1].label}</h2>
            <p className="text-light text-sm mt-1">{STEPS[step-1].desc}</p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Business Name</label>
                <input className="input-field" placeholder="e.g. Chilleshe Retail Ltd"
                  value={form.businessName} onChange={e => set('businessName', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">PACRA Reg Number</label>
                <input className="input-field" placeholder="120220XXXXX"
                  value={form.pacrRegNumber} onChange={e => set('pacrRegNumber', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Business Type</label>
                <select className="input-field" value={form.businessType} onChange={e => set('businessType', e.target.value)}>
                  {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button onClick={nextStep} className="btn-primary mt-2">Continue <ArrowRight size={15} /></button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Full Name</label>
                <input className="input-field" placeholder="e.g. Mwape Banda"
                  value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="input-field" placeholder="mwape@hardware.zm"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                <button onClick={nextStep} className="btn-primary">Continue <ArrowRight size={15} /></button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-11"
                    placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" onClick={() => setShow(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="password" className="input-field pl-10"
                    placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-outline">Back</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                    : <>Create Account <ArrowRight size={15} /></>}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-light text-sm mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

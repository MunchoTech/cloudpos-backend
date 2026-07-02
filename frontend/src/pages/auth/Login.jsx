import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Globe } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuth, MOCK_USER, MOCK_CREDENTIALS } from '../../context/AuthContext'
import { USE_MOCK } from '../../hooks/useApi'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email,   setEmail]  = useState('')
  const [password, setPw]    = useState('')
  const [showPw,  setShow]   = useState(false)
  const [loading, setLoad]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoad(true)

    // Demo bypass — only active when USE_MOCK = true
    if (USE_MOCK && email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      login(MOCK_USER, 'mock-jwt-token-dev')
      toast.success(`Welcome back, ${MOCK_USER.fullName}!`)
      navigate('/dashboard')
      setLoad(false)
      return
    }

    try {
      const res = await authService.login(email, password)
      if (res.success) {
        login(res.data, res.data.token)
        toast.success(`Welcome back, ${res.data.fullName}!`)
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally { setLoad(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#041520' }}>
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #041520 0%, #062030 50%, #041520 100%)' }}>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,170,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <Shield size={20} className="text-primary" />
            </div>
            <span className="text-xl font-bold text-primary tracking-wide">CloudPOS</span>
          </div>
          <div className="mb-auto pt-20">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">Zambia's Professional Trading Gateway</p>
            <h1 className="text-5xl font-bold text-bright leading-tight mb-6">
              Manage your<br /><span className="text-primary">business</span><br />smarter.
            </h1>
            <p className="text-light text-base leading-relaxed max-w-sm">
              Real-time inventory tracking, lightning-fast sales processing, and actionable insights — all in one platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-auto">
            {['ZRA Compliant', 'Local Currency (K)', 'Offline Ready', 'Secure Session'].map(f => (
              <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-light"
                style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />{f}
              </div>
            ))}
          </div>
          <p className="text-muted text-xs mt-6">© 2024 CloudPOS · Zambia Node 01</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 lg:max-w-xl flex flex-col items-center justify-center px-8 py-12" style={{ background: '#051825' }}>
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Shield size={22} className="text-primary" />
          <span className="text-lg font-bold text-primary">CloudPOS</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-bright mb-2">Welcome back</h2>
            <p className="text-light text-sm">Sign in to your business account</p>
          </div>

          {/* Demo banner — only shown in mock mode */}
          {USE_MOCK && (
            <div className="mb-6 p-3 rounded-lg text-xs" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
              <p className="text-primary font-semibold mb-1">🔧 Demo Mode</p>
              <p className="text-light">admin@cloudpos.zm · password123</p>
              <button onClick={() => { setEmail('admin@cloudpos.zm'); setPw('password123') }}
                className="text-primary underline mt-1 hover:no-underline">Auto-fill →</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Store Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" className="input-field pl-10" placeholder="e.g. mwape@hardware.zm"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-muted uppercase tracking-widest">Secure Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-11"
                  placeholder="••••••••" value={password} onChange={e => setPw(e.target.value)} required />
                <button type="button" onClick={() => setShow(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-light text-sm mt-6">
            New to the network?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

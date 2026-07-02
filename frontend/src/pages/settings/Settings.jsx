import { useState } from 'react'
import { User, Building2, Shield, Printer, Save, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile',  label: 'Business Profile', icon: Building2 },
  { id: 'account',  label: 'Account',           icon: User      },
  { id: 'receipt',  label: 'Receipt Settings',  icon: Printer   },
  { id: 'security', label: 'Security',          icon: Shield    },
]

function ProfileTab({ user }) {
  const [form, setForm] = useState({
    businessName: user?.businessName || '',
    email:        user?.email        || '',
    fullName:     user?.fullName     || '',
    businessType: 'General Retail',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-bright font-semibold mb-1">Business Profile</h3>
        <p className="text-muted text-sm">Update your business information</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Business Name</label>
          <input className="input-field" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Business Type</label>
          <select className="input-field" value={form.businessType} onChange={e => set('businessType', e.target.value)}>
            {['General Retail','Wholesale','Hardware','Pharmacy','Electronics','Supermarket','Other'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Owner Name</label>
          <input className="input-field" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Email Address</label>
          <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <button onClick={() => toast.success('Profile saved')} className="btn-primary w-auto px-6 py-2.5">
        <Save size={14} /> Save Changes
      </button>
    </div>
  )
}

function AccountTab({ user }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-bright font-semibold mb-1">Account</h3>
        <p className="text-muted text-sm">Manage your login credentials</p>
      </div>
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#041520', border: '1px solid #1E3A52' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-dark" style={{ background: '#00D4AA' }}>
          {user?.fullName?.[0] || 'U'}
        </div>
        <div>
          <p className="text-bright font-semibold">{user?.fullName}</p>
          <p className="text-muted text-sm">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,212,170,0.12)', color: '#00D4AA' }}>
            {user?.role === 'BUSINESS_OWNER' ? 'Business Owner' : 'Cashier'}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-bright text-sm font-semibold">Change Password</h4>
        {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
          <div key={label}>
            <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">{label}</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
        ))}
        <button onClick={() => toast.success('Password updated')} className="btn-primary w-auto px-6 py-2.5">
          <Save size={14} /> Update Password
        </button>
      </div>
    </div>
  )
}

function ReceiptTab() {
  const [form, setForm] = useState({ businessName: 'Chilleshe Retail Ltd', footer: 'Thank you for shopping with us!', showLogo: true, showTax: true })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-bright font-semibold mb-1">Receipt Settings</h3>
        <p className="text-muted text-sm">Customise what appears on printed receipts</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Business Name on Receipt</label>
          <input className="input-field" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">Receipt Footer Message</label>
          <input className="input-field" value={form.footer} onChange={e => set('footer', e.target.value)} />
        </div>
        {[{ key: 'showLogo', label: 'Show business name header' }, { key: 'showTax', label: 'Show tax breakdown' }].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#041520', border: '1px solid #1E3A52' }}>
            <span className="text-bright text-sm">{label}</span>
            <button onClick={() => set(key, !form[key])} className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: form[key] ? '#00D4AA' : '#1E3A52' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: form[key] ? '1.5rem' : '0.25rem' }} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => toast.success('Receipt settings saved')} className="btn-primary w-auto px-6 py-2.5">
        <Save size={14} /> Save Settings
      </button>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-bright font-semibold mb-1">Security</h3>
        <p className="text-muted text-sm">Manage access and session settings</p>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Two-factor authentication', sub: 'Add an extra layer of security',   badge: 'Coming soon', color: '#4A6B85' },
          { label: 'Active sessions',           sub: 'View and manage logged-in devices', badge: 'View',       color: '#00D4AA' },
          { label: 'Login history',             sub: 'See recent sign-in activity',       badge: 'View',       color: '#00D4AA' },
        ].map(({ label, sub, badge, color }) => (
          <div key={label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#041520', border: '1px solid #1E3A52' }}>
            <div>
              <p className="text-bright text-sm font-medium">{label}</p>
              <p className="text-muted text-xs mt-0.5">{sub}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${color}18`, color }}>{badge}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <h4 className="text-red-400 text-sm font-semibold">Danger Zone</h4>
        <p className="text-muted text-xs">These actions are irreversible. Please be certain.</p>
        <button onClick={() => toast.error('Contact support to delete your account')}
          className="px-4 py-2 rounded-lg text-sm font-medium text-red-400"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const { user }   = useAuth()
  const [active, setActive] = useState('profile')

  const CONTENT = {
    profile:  <ProfileTab user={user} />,
    account:  <AccountTab user={user} />,
    receipt:  <ReceiptTab />,
    security: <SecurityTab />,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-bright">Settings</h1>
        <p className="text-light text-sm mt-1">Manage your business preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === id ? 'rgba(0,212,170,0.08)' : 'transparent',
                border:     active === id ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                color:      active === id ? '#00D4AA' : '#4A6B85',
              }}>
              <div className="flex items-center gap-3"><Icon size={16} />{label}</div>
              {active === id && <ChevronRight size={14} />}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-xl p-6" style={{ background: '#0B1E30', border: '1px solid #1E3A52' }}>
          {CONTENT[active]}
        </div>
      </div>
    </div>
  )
}

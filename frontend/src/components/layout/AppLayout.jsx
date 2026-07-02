import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, ShoppingCart, BarChart2, Settings, LogOut, Shield, Menu, X, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/inventory',  icon: Package,          label: 'Inventory'       },
  { to: '/categories', icon: Tag,              label: 'Categories'      },
  { to: '/pos',        icon: ShoppingCart,     label: 'Point of Sale'   },
  { to: '/sales',      icon: TrendingUp,       label: 'Sales'           },
  { to: '/reports',    icon: BarChart2,        label: 'Reports'         },
  { to: '/settings',   icon: Settings,         label: 'Settings'        },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [mobileOpen, setMobile] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const Sidebar = () => (
    <aside className="w-60 flex-shrink-0 h-screen flex flex-col"
      style={{ background: '#051825', borderRight: '1px solid #1E3A52' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.25)' }}>
          <Shield size={16} className="text-primary" />
        </div>
        <span className="font-bold text-primary text-base tracking-wide">CloudPOS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobile(false)}>
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-border flex-shrink-0">
        {user && (
          <div className="px-3 py-2.5 rounded-xl mb-1"
            style={{ background: 'rgba(0,212,170,0.05)' }}>
            <p className="text-bright text-xs font-semibold truncate">{user.fullName}</p>
            <p className="text-muted text-xs truncate">{user.businessName}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className="sidebar-link w-full hover:!bg-red-500/10 hover:!text-red-400">
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#041520' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/70 lg:hidden" onClick={() => setMobile(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-y-0 left-0 z-30 lg:hidden">
          <Sidebar />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0"
          style={{ background: '#051825' }}>
          <button onClick={() => setMobile(true)} className="text-muted hover:text-primary transition-colors">
            <Menu size={20} />
          </button>
          <span className="font-bold text-primary">CloudPOS</span>
          <div className="w-5" />
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

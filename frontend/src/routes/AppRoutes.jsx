import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'

// Auth
import Login    from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// App
import Dashboard   from '../pages/dashboard/Dashboard'
import Inventory   from '../pages/inventory/Inventory'
import ProductForm from '../pages/inventory/ProductForm'
import Categories  from '../pages/inventory/Categories'
import POS         from '../pages/pos/POS'
import Sales       from '../pages/sales/Sales'
import Reports     from '../pages/reports/Reports'
import Settings    from '../pages/settings/Settings'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

      {/* Protected */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="dashboard"       element={<Dashboard />} />
              <Route path="inventory"       element={<Inventory />} />
              <Route path="inventory/new"   element={<ProductForm />} />
              <Route path="inventory/:id/edit" element={<ProductForm />} />
              <Route path="categories"      element={<Categories />} />
              <Route path="pos"             element={<POS />} />
              <Route path="sales"           element={<Sales />} />
              <Route path="reports"         element={<Reports />} />
              <Route path="settings"        element={<Settings />} />
              <Route path="*"               element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

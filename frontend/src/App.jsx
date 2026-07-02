import { BrowserRouter } from 'react-router-dom'
import { Toaster }        from 'react-hot-toast'
import { AuthProvider }   from './context/AuthContext'
import { CartProvider }   from './context/CartContext'
import AppRoutes          from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0F1F35',
                color: '#C8D8E8',
                border: '1px solid #1A2F4A',
                borderRadius: '10px',
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#00D4AA', secondary: '#0A1628' } },
              error:   { iconTheme: { primary: '#f87171', secondary: '#0A1628' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock user for development (remove when backend is ready)
const MOCK_USER = {
  id: 1,
  fullName: 'Mwape Banda',
  businessName: "Chilleshe Retail Ltd",
  email: 'mwape@hardware.zm',
  role: 'BUSINESS_OWNER',
}
const MOCK_CREDENTIALS = { email: 'admin@cloudpos.zm', password: 'password123' }

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cloudpos_token')
    const savedUser  = localStorage.getItem('cloudpos_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('cloudpos_token', jwt)
    localStorage.setItem('cloudpos_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cloudpos_token')
    localStorage.removeItem('cloudpos_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { MOCK_USER, MOCK_CREDENTIALS }

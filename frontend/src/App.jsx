import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // DEV MODE: Auto-authenticate in development for local testing
    // Set VITE_DEV_MODE=true in .env or run with: VITE_DEV_MODE=true npm run dev
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'
    
    if (isDevMode) {
      // Auto-login with mock user for local testing
      const mockUser = { username: 'dev-user', id: 'dev-123' }
      localStorage.setItem('token', 'dev-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      setIsAuthenticated(true)
      setUser(mockUser)
      return
    }

    // Check if user is already logged in (normal flow)
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
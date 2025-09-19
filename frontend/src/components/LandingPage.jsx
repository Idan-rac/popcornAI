import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './LandingPage.css'

const LandingPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header Section */}
        <header className="landing-header">
          <div className="logo-section">
            <h1 className="logo">MovieApp</h1>
            <p className="tagline">Discover, Rate, and Share Your Favorite Movies</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="landing-main">
          <div className="auth-card">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                Login
              </button>
              <button
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabChange('register')}
              >
                Register
              </button>
            </div>

            {/* Form Content */}
            <div className="form-content">
              {activeTab === 'login' ? (
                <LoginForm onLogin={onLogin} />
              ) : (
                <RegisterForm onLogin={onLogin} />
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Why Choose MovieApp?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎬</div>
                <h3>Discover Movies</h3>
                <p>Find your next favorite film from our extensive database</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <h3>Rate & Review</h3>
                <p>Share your thoughts and rate movies you've watched</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <h3>Connect</h3>
                <p>Follow friends and see what they're watching</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2024 MovieApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage

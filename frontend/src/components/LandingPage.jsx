import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import PopcornLogo from './PopcornLogo'
import MagicBento from './MagicBento'
import './LandingPage.css'

const LandingPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <MagicBento>
      <div className="landing-page">
        <div className="landing-container">
          {/* Header Section */}
          <header className="landing-header">
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
            <h2>Why Choose PopcornAI?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎬</div>
                <h3>Discover Movies</h3>
                <p>Let PopcornAI help you choose the movie especially for you</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📧</div>
                <h3>Contact</h3>
                <p>Having an issue with the website? Contact us:<br/>popcornAI21@gmail.com</p>
              </div>
            </div>
          </div>
        </main>

          {/* Footer */}
          <footer className="landing-footer">
            <p>&copy; 2024 PopcornAI. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </MagicBento>
  )
}

export default LandingPage

import { useState } from 'react'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [userInput, setUserInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setIsSubmitting(true)
    
    // TODO: Implement AI processing logic here
    console.log('User input:', userInput)
    
    // Simulate processing time
    setTimeout(() => {
      setIsSubmitting(false)
      // TODO: Handle the response and show results
    }, 2000)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">PopcornAI</h1>
          </div>
          <div className="user-section">
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="main-input-section">
          <h2 className="input-heading">Tell me how you feel and what you would like to watch</h2>
          
          <form onSubmit={handleSubmit} className="input-form">
            <div className="text-area-container">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="I'm feeling adventurous and want to watch something with action and mystery..."
                className="main-textarea"
                rows={8}
                disabled={isSubmitting}
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-input-btn"
              disabled={isSubmitting || !userInput.trim()}
            >
              {isSubmitting ? (
                <span className="loading-spinner">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                'Get Movie Recommendations'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

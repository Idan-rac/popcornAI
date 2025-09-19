import { useState } from 'react'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [userInput, setUserInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setIsSubmitting(true)
    setError('')
    setRecommendations(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      })

      const data = await response.json()

      if (response.ok) {
        setRecommendations(data)
      } else {
        setError(data.error || 'Failed to get recommendations. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.')
    } finally {
      setIsSubmitting(false)
    }
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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {recommendations && (
            <div className="recommendations-section">
              <h3 className="recommendations-heading">
                🎬 Movie Recommendations for: "{recommendations.userInput}"
              </h3>
              <div className="movies-grid">
                {recommendations.movies.map((movie, index) => (
                  <div key={index} className="movie-card">
                    <div className="movie-header">
                      <h4 className="movie-title">{movie.title}</h4>
                      <div className="movie-year">{movie.year}</div>
                    </div>
                    <div className="movie-genre">{movie.genre}</div>
                    <div className="movie-rating">⭐ {movie.rating}</div>
                    <p className="movie-reason">{movie.reason}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setRecommendations(null)
                  setUserInput('')
                }}
                className="new-search-btn"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

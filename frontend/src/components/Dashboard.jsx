import { useState } from 'react'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [userInput, setUserInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

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

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const closeModal = () => {
    setSelectedMovie(null)
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
                  <div key={index} className="movie-card" onClick={() => handleMovieClick(movie)}>
                    {movie.poster_url && (
                      <div className="movie-poster">
                        <img 
                          src={movie.poster_url} 
                          alt={`${movie.title} poster`}
                          className="poster-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {movie.match_percentage && (
                          <div className="match-percentage">
                            {movie.match_percentage}% Match
                          </div>
                        )}
                      </div>
                    )}
                    <div className="movie-content">
                      <div className="movie-header">
                        <h4 className="movie-title">{movie.title}</h4>
                        <div className="movie-year">{movie.year}</div>
                      </div>
                      <div className="movie-genre">{movie.genre}</div>
                      <div className="movie-rating">
                        ⭐ {movie.tmdb_rating ? movie.tmdb_rating.toFixed(1) : movie.rating}
                      </div>
                      <p className="movie-reason">{movie.reason}</p>
                    </div>
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

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-movie-details">
              <div className="modal-poster-section">
                {selectedMovie.poster_url && (
                  <img 
                    src={selectedMovie.poster_url} 
                    alt={`${selectedMovie.title} poster`}
                    className="modal-poster"
                  />
                )}
                {selectedMovie.match_percentage && (
                  <div className="modal-match-circle">
                    <div className="match-percentage-large">{selectedMovie.match_percentage}%</div>
                    <div className="match-label">Match</div>
                  </div>
                )}
              </div>
              <div className="modal-info-section">
                <h2 className="modal-title">{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <div className="modal-year">{selectedMovie.year}</div>
                  <div className="modal-genre">{selectedMovie.genre}</div>
                  <div className="modal-rating">⭐ {selectedMovie.tmdb_rating ? selectedMovie.tmdb_rating.toFixed(1) : selectedMovie.rating}</div>
                </div>
                
                <div className="modal-explanation">
                  <h3>Why This Movie is Perfect for You</h3>
                  <p>{selectedMovie.detailed_explanation || selectedMovie.reason}</p>
                </div>

                {selectedMovie.overview && (
                  <div className="modal-overview">
                    <h3>Plot Summary</h3>
                    <p>{selectedMovie.overview}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

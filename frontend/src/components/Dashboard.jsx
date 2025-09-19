import { useState, useEffect } from 'react'
import WatchList from './WatchList'
import PopcornLogo from './PopcornLogo'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [userInput, setUserInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [currentPage, setCurrentPage] = useState('chat') // 'chat' or 'watchlist'
  const [notification, setNotification] = useState(null)
  const [watchlistStatus, setWatchlistStatus] = useState({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load watchlist on component mount
  useEffect(() => {
    loadWatchlist()
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const loadWatchlist = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWatchlist(data.watchlist)
        
        // Create status object for quick lookup
        const status = {}
        data.watchlist.forEach(item => {
          status[item.movie_id] = true
        })
        setWatchlistStatus(status)
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    }
  }

  const addToWatchlist = async (movie) => {
    try {
      const token = localStorage.getItem('token')
      const movieId = movie.tmdb_id || `${movie.title}-${movie.year}`
      
      const response = await fetch('http://localhost:5000/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: movieId,
          movie_title: movie.title,
          movie_poster: movie.poster_url
        })
      })

      if (response.ok) {
        const data = await response.json()
        setWatchlist(prev => [data.watchlistItem, ...prev])
        setWatchlistStatus(prev => ({ ...prev, [movieId]: true }))
        showNotification('Added to Watch List')
      } else {
        const errorData = await response.json()
        showNotification(errorData.error || 'Failed to add to watchlist')
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      showNotification('Failed to add to watchlist')
    }
  }

  const removeFromWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`http://localhost:5000/api/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item.movie_id !== movieId))
        setWatchlistStatus(prev => ({ ...prev, [movieId]: false }))
        showNotification('Removed from Watch List')
      } else {
        const errorData = await response.json()
        showNotification(errorData.error || 'Failed to remove from watchlist')
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      showNotification('Failed to remove from watchlist')
    }
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const navigateToWatchlist = () => {
    setCurrentPage('watchlist')
  }

  const navigateToChat = () => {
    setCurrentPage('chat')
  }

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
    setError('') // Clear error when user types
    
    // Auto-expand textarea based on content
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.max(80, textarea.scrollHeight) + 'px'
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

  const resetToMainScreen = () => {
    // Clear all state to return to fresh start
    setUserInput('')
    setRecommendations(null)
    setError('')
    setSelectedMovie(null)
    setCurrentPage('chat')
    setNotification(null)
    setIsMobileMenuOpen(false)
    
    // Reset textarea height to default
    const textarea = document.querySelector('.main-textarea')
    if (textarea) {
      textarea.style.height = '80px'
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    onLogout()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo" onClick={resetToMainScreen}>
              <PopcornLogo size={50} />
              <span className="logo-text">PopcornAI</span>
            </div>
          </div>
          <div className="user-section">
            <button 
              className="watchlist-btn"
              onClick={navigateToWatchlist}
            >
              ❤️ Watch List ({watchlist.length})
            </button>
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        {/* Mobile-only minimal watchlist button */}
        <div className="mobile-watchlist-container">
          <button 
            className="mobile-watchlist-btn"
            onClick={navigateToWatchlist}
            title={`Watch List (${watchlist.length})`}
          >
            ❤️
          </button>
        </div>
        
        {/* Mobile-only three-dots menu button */}
        <div className="mobile-menu-container">
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            title="Menu"
          >
            ⋯
          </button>
          
          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-dropdown">
              <button 
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Conditional Rendering */}
      {currentPage === 'watchlist' ? (
        <WatchList 
          user={user} 
          onBackToChat={navigateToChat}
          onLogout={onLogout}
          onWatchlistUpdate={loadWatchlist}
        />
      ) : (
        <main className="dashboard-content">
          <div className="main-input-section">
          <div className="input-logo">
            <PopcornLogo size={120} />
          </div>
          <h2 className="input-heading">Tell me how you feel and what you would like to watch</h2>
          
          <form onSubmit={handleSubmit} className="input-form">
            <div className="text-area-container">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="I'm feeling adventurous and want to watch something with action and mystery..."
                className="main-textarea"
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
                {recommendations.movies.map((movie, index) => {
                  const movieId = movie.tmdb_id || `${movie.title}-${movie.year}`
                  const isInWatchlist = watchlistStatus[movieId]
                  
                  return (
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
                          <button 
                            className={`heart-btn ${isInWatchlist ? 'in-watchlist' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isInWatchlist) {
                                removeFromWatchlist(movieId)
                              } else {
                                addToWatchlist(movie)
                              }
                            }}
                          >
                            {isInWatchlist ? '❤️' : '🤍'}
                          </button>
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
                  )
                })}
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

        {/* Notification Popup */}
        {notification && (
          <div className="notification-popup">
            <div className="notification-content">
              <span className="notification-icon">❤️</span>
              <span className="notification-text">{notification}</span>
            </div>
          </div>
        )}
      </main>
      )}
    </div>
  )
}

export default Dashboard

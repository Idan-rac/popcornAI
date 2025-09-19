import { useState, useEffect } from 'react'
import './WatchList.css'

const WatchList = ({ user, onBackToChat, onLogout, onWatchlistUpdate }) => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  // Load watchlist on component mount
  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWatchlist(data.watchlist)
      } else {
        console.error('Failed to load watchlist')
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
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
        showNotification('Removed from Watch List')
        // Notify parent component to update its watchlist state
        if (onWatchlistUpdate) {
          onWatchlistUpdate()
        }
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

  if (loading) {
    return (
      <div className="watchlist-page">
        <main className="watchlist-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your watch list...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="watchlist-page">
      <main className="watchlist-content">
        <div className="watchlist-container">
          <div className="watchlist-page-header">
            <button 
              className="back-to-chat-btn"
              onClick={onBackToChat}
            >
              ← Back to Chat
            </button>
            <h2 className="watchlist-page-title">❤️ Your Watch List</h2>
            <div className="watchlist-count">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'}
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="empty-watchlist">
              <div className="empty-watchlist-icon">🎬</div>
              <h3>Your watch list is empty</h3>
              <p>Start exploring movies and add them to your watch list!</p>
              <button 
                className="explore-movies-btn"
                onClick={onBackToChat}
              >
                Explore Movies
              </button>
            </div>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((item) => (
                <div key={item.id} className="watchlist-item">
                  {item.movie_poster && (
                    <div className="watchlist-poster">
                      <img 
                        src={item.movie_poster} 
                        alt={`${item.movie_title} poster`}
                        className="watchlist-poster-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button 
                        className="remove-from-watchlist-btn"
                        onClick={() => removeFromWatchlist(item.movie_id)}
                        title="Remove from watch list"
                      >
                        ❤️
                      </button>
                    </div>
                  )}
                  <div className="watchlist-content">
                    <h4 className="watchlist-movie-title">{item.movie_title}</h4>
                    <p className="watchlist-date">
                      Added {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Notification Popup */}
      {notification && (
        <div className="notification-popup">
          <div className="notification-content">
            <span className="notification-icon">❤️</span>
            <span className="notification-text">{notification}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default WatchList

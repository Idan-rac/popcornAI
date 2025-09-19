import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">MovieApp</h1>
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
        <div className="dashboard-hero">
          <h2>Your Movie Dashboard</h2>
          <p>Welcome to your personalized movie experience</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🎬</div>
            <h3>Browse Movies</h3>
            <p>Discover new films and explore our extensive movie database</p>
            <button className="card-btn">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Share your thoughts and rate movies you've watched</p>
            <button className="card-btn">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Watchlist</h3>
            <p>Keep track of movies you want to watch later</p>
            <button className="card-btn">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Social</h3>
            <p>Connect with friends and see what they're watching</p>
            <button className="card-btn">Coming Soon</button>
          </div>
        </div>

        <div className="user-info-section">
          <h3>Account Information</h3>
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">User ID:</span>
              <span className="detail-value">{user.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member since:</span>
              <span className="detail-value">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

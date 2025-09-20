const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// TMDB API functions
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function searchMovieOnTMDB(movieTitle, year) {
  try {
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(movieTitle)}&year=${year}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids
      };
    }
    return null;
  } catch (error) {
    console.error('TMDB search error:', error);
    return null;
  }
}

async function getMoviePoster(movieTitle, year) {
  const movieData = await searchMovieOnTMDB(movieTitle, year);
  if (movieData && movieData.poster_path) {
    return {
      poster_url: `${TMDB_IMAGE_BASE_URL}${movieData.poster_path}`,
      tmdb_id: movieData.id,
      tmdb_rating: movieData.vote_average,
      overview: movieData.overview
    };
  }
  return null;
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, username, password, created_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Movie recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'User input is required' });
    }

    const prompt = `Based on the following user request, recommend exactly 9 movies that would be perfect for them. 

User's request: "${userInput}"

Please respond with a JSON array of exactly 9 movie recommendations. Each movie should include:
- title: The movie title
- year: Release year
- genre: Main genre(s)
- reason: Brief explanation (1-2 sentences) of why this movie matches their request
- rating: IMDB rating if known, or "N/A" if not available
- match_percentage: A number between 70-95 representing how well this movie matches their request (higher = better match)
- detailed_explanation: A longer explanation (2-3 sentences) of why this movie is perfect for them based on their specific request

Format your response as a valid JSON array like this:
[
  {
    "title": "Movie Title",
    "year": 2023,
    "genre": "Action, Thriller",
    "reason": "This movie perfectly matches your request because...",
    "rating": "8.5",
    "match_percentage": 92,
    "detailed_explanation": "This movie is an excellent choice for you because it perfectly captures the mood and style you're looking for. The action sequences are thrilling and the storyline keeps you engaged throughout. Based on your request for something exciting and fast-paced, this film delivers exactly what you need."
  }
]

Make sure the recommendations are diverse and cover different aspects of what the user is looking for.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable movie expert who provides personalized movie recommendations. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const movies = JSON.parse(responseText);
      
      if (!Array.isArray(movies) || movies.length === 0) {
        throw new Error('Invalid response format');
      }

      // Fetch posters for each movie
      const moviesWithPosters = await Promise.all(
        movies.map(async (movie) => {
          try {
            const posterData = await getMoviePoster(movie.title, movie.year);
            return {
              ...movie,
              poster_url: posterData ? posterData.poster_url : null,
              tmdb_id: posterData ? posterData.tmdb_id : null,
              tmdb_rating: posterData ? posterData.tmdb_rating : null,
              overview: posterData ? posterData.overview : null
            };
          } catch (error) {
            console.error(`Error fetching poster for ${movie.title}:`, error);
            return {
              ...movie,
              poster_url: null,
              tmdb_id: null,
              tmdb_rating: null,
              overview: null
            };
          }
        })
      );

      res.json({
        success: true,
        movies: moviesWithPosters,
        userInput: userInput
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', responseText);
      res.status(500).json({ error: 'Failed to parse AI response' });
    }

  } catch (error) {
    console.error('Movie recommendation error:', error);
    res.status(500).json({ error: 'Failed to get movie recommendations' });
  }
});

// Watchlist API routes

// Add movie to watchlist
app.post('/api/watchlist', authenticateToken, async (req, res) => {
  try {
    const { movie_id, movie_title, movie_poster } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!movie_id || !movie_title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    // Check if movie is already in watchlist
    const existingMovie = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movie_id]
    );

    if (existingMovie.rows.length > 0) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    // Add movie to watchlist
    const result = await pool.query(
      'INSERT INTO watchlist (user_id, movie_id, movie_title, movie_poster) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, movie_id, movie_title, movie_poster]
    );

    res.status(201).json({
      message: 'Movie added to watchlist',
      watchlistItem: result.rows[0]
    });

  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's watchlist
app.get('/api/watchlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      watchlist: result.rows
    });

  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove movie from watchlist
app.delete('/api/watchlist/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2 RETURNING *',
      [userId, movieId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    res.json({
      message: 'Movie removed from watchlist',
      removedItem: result.rows[0]
    });

  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if movie is in user's watchlist
app.get('/api/watchlist/check/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );

    res.json({
      inWatchlist: result.rows.length > 0
    });

  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

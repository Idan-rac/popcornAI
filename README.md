# Movie Application

A full-stack web application with React frontend, Node.js backend, and PostgreSQL database, all containerized with Docker.

## Project Structure

```
project-root/
├── frontend/          # React app with Vite
├── backend/           # Node.js Express API server
├── db/               # PostgreSQL setup (init SQL + data volume)
├── docker-compose.yml
└── README.md
```

## Features

- **Frontend**: React with Vite for fast development
- **Backend**: Node.js Express API with JWT authentication
- **Database**: PostgreSQL with user management
- **Authentication**: Secure login/register with bcrypt password hashing
- **Containerization**: Docker Compose for easy deployment

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Modern CSS with gradients and responsive design

### Backend
- Node.js
- Express.js
- PostgreSQL (pg driver)
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Database
- PostgreSQL 15
- User table with id, username, password, created_at

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Running the Application

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/movie2
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### First Time Setup

1. The database will be automatically initialized with the `users` table
2. Create your first account by registering on the frontend
3. Use the login form to authenticate

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login with credentials
- `GET /api/health` - Health check endpoint

### Request/Response Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

## Development

### Running Individual Services

**Backend only:**
```bash
cd backend
npm install
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
```

**Database only:**
```bash
docker-compose up db
```

### Environment Variables

The backend uses the following environment variables (configured in docker-compose.yml):

- `DB_HOST` - Database host (default: db)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: movie_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time (default: 24h)
- `PORT` - Backend port (default: 5000)

## Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens for stateless authentication
- CORS configured for frontend-backend communication
- Input validation on both frontend and backend
- SQL injection protection with parameterized queries

## Docker Services

- **frontend**: React app served on port 3000
- **backend**: Express API on port 5000
- **db**: PostgreSQL database on port 5432
- **postgres_data**: Named volume for database persistence

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5000, and 5432 are available
2. **Database connection**: Wait for the database health check to pass
3. **Build failures**: Try `docker-compose down` and `docker-compose up --build`

### Logs

View logs for specific services:
```bash
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

### Reset Database

To reset the database and start fresh:
```bash
docker-compose down -v
docker-compose up --build
```

## Next Steps

This scaffold provides a solid foundation for building a movie application. Consider adding:

- Movie data models and API endpoints
- User favorites and watchlists
- Search and filtering functionality
- Image uploads for movie posters
- User profiles and preferences
- Admin panel for content management

## License

MIT License - feel free to use this scaffold for your projects!

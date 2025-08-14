# ArtPath Backend

This directory contains the backend server for the ArtPath platform.

## Structure
- `server.js` - Main server file
- `config/` - Configuration files (database, environment)
- `models/` - MongoDB/Mongoose models
- `routes/` - API route handlers
- `middleware/` - Custom middleware (auth, validation, etc.)
- `controllers/` - Business logic controllers
- `utils/` - Utility functions and helpers
- `uploads/` - Temporary file uploads (before cloud storage)

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start development server: `npm run dev`
4. Backend runs on port 5000, frontend on port 3000

## API Endpoints
- `/api/auth` - Authentication (login, register, logout)
- `/api/users` - User management
- `/api/artists` - Artist profiles and portfolios
- `/api/artworks` - Artwork management
- `/api/commissions` - Commission requests
- `/api/messages` - Messaging system
- `/api/search` - Search and discovery


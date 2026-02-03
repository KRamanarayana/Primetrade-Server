# Primetrade Task Manager - Backend

This is the backend API for the Primetrade Task Manager, built with Node.js, Express, and MongoDB.

## 🚀 Features
- **User Authentication**: Secure JWT-based registration and login system.
- **Task Management**: Full CRUD operations for project tasks.
- **Search & Filter**: Server-side filtering by completion status and text search.
- **Pagination**: Optimized data fetching with page-based results.
- **CORS Configured**: Ready for cross-origin communication with the React frontend.

## 🛠️ Tech Stack
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL Database (via Mongoose)
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt.js**: Password hashing

## ⚙️ Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI="mongodb+srv://Gireesh:Gireeshkumar99@cluster0.lhyi7aj.mongodb.net/?appName=Cluster0"
JWT_SECRET=dev_secret_key_123
CLIENT_URL=http://localhost:3000
```

## 📦 Installation & Setup
1. Clone the repository: `git clone https://github.com/KRamanarayana/Primetrade-Server`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. For production: `npm start`

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create a new user
- `POST /api/v1/auth/login` - Authenticate user & get token
- `GET /api/v1/auth/me` - Get current user profile (Requires Token)

### Tasks (All require Authorization header)
- `GET /api/v1/tasks` - Get all tasks (with pagination, search, filter)
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update an existing task
- `DELETE /api/v1/tasks/:id` - Remove a task

## 🔒 Security
- Passwords are encrypted using bcrypt.
- Routes are protected via JWT middleware.
- CORS is restricted to trusted origins.

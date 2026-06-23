# Social Network Friend Recommendation System Using Graph Algorithms

A MERN stack application that recommends friends using graph algorithms to analyze mutual connections.

## Features

✅ **User Authentication** - Register and login with JWT tokens  
✅ **User Profiles** - View and edit user profiles with bio and pictures  
✅ **Friend Requests** - Send, accept, and reject friend requests  
✅ **Friends List** - Manage your friends and remove connections  
✅ **Graph-Based Recommendations** - AI-powered suggestions based on mutual friends  
✅ **Discover Users** - Search and browse users in the network  
✅ **Mutual Friends** - See how you're connected with other users  

## Project Structure

```
MiniProject02/
├── backend/                    # Node.js + Express + MongoDB
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── FriendRequest.js    # Friend request schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── userController.js   # User profile logic
│   │   ├── friendController.js # Friend request logic
│   │   └── recommendationController.js # Graph recommendations
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── friends.js
│   │   └── recommendations.js
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   ├── server.js              # Express app
│   └── package.json
│
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Discover.jsx
│   │   │   ├── Friends.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── endpoints.js
│   │   │   ├── AuthContext.js
│   │   │   └── useAuth.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json               # Monorepo configuration
├── .gitignore
└── README.md
```

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone/Extract Project
```bash
cd MiniProject02
```

### 2. Install Dependencies
```bash
npm install
```

This installs all dependencies for both backend and frontend via the monorepo workspace.

### 3. Configure Environment

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-network
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

**Frontend (.env):**
```bash
cp frontend/.env.example frontend/.env
```

Frontend `.env` is already configured to use `http://localhost:5000/api`.

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

Or use MongoDB Atlas connection string in `MONGODB_URI`.

### 5. Seed Database (Optional)

```bash
npm run seed
```

This creates 12 sample users with friendship connections. Test credentials:
- Email: `alice@example.com`
- Password: `password123`

(See `backend/scripts/seed.js` for all test accounts)

### 6. Start Development Servers

**Both backend and frontend together:**
```bash
npm run dev
```

**Or separately:**
```bash
npm run backend    # Terminal 1 - http://localhost:5000
npm run frontend   # Terminal 2 - http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Profile
- `GET /api/users/profile` - Get current user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/:userId` - Get user by ID (protected)
- `GET /api/users/search?q=name` - Search users (protected)
- `GET /api/users/all` - Get all users (protected)

### Friend Requests
- `POST /api/friends/request/send` - Send friend request (protected)
- `GET /api/friends/requests/pending` - Get pending requests (protected)
- `GET /api/friends/requests/sent` - Get sent requests (protected)
- `POST /api/friends/request/accept` - Accept request (protected)
- `POST /api/friends/request/reject` - Reject request (protected)
- `POST /api/friends/request/cancel` - Cancel sent request (protected)
- `POST /api/friends/remove` - Remove friend (protected)
- `GET /api/friends/list` - Get friends list (protected)

### Recommendations (Graph Algorithm)
- `GET /api/recommendations?limit=10` - Get friend recommendations (protected)
- `GET /api/recommendations/mutual/:userId` - Get mutual friends with user (protected)

## How the Recommendation Algorithm Works

The system uses **common-neighbor graph traversal** to recommend friends:

1. **Graph Structure**: Users are nodes, friendships are undirected edges
2. **Traversal**: For each friend's friends, count mutual connections
3. **Filtering**: Exclude self, existing friends, and pending requests
4. **Ranking**: Sort by mutual friend count (descending)
5. **Output**: Return top 10 with mutual friends list and readable reason

**Example:**
- Alice has friends: Bob, Carol
- Bob has friends: Alice, David, Emma
- Carol has friends: Alice, Frank
- David has friends: Bob, Frank
- Emma has friends: Bob

For Alice, recommendations:
1. **David** - 2 mutual friends (Bob, Frank) ← Recommended
2. **Emma** - 1 mutual friend (Bob)
3. **Frank** - 2 mutual friends (Carol, David) ← Recommended

## Testing the Application

### 1. Create Test Account
- Navigate to `http://localhost:5173/register`
- Fill in registration form
- Or login with seeded test account:
  - Email: `alice@example.com`
  - Password: `password123`

### 2. Test Friend Recommendations
1. Login to the app
2. Go to **Dashboard** → See AI recommendations based on mutual friends
3. Click **Add Friend** to send requests

### 3. Test Discover/Search
1. Go to **Discover** page
2. Search for users by name or email
3. View user profiles and send friend requests

### 4. Manage Relationships
1. **Friends Page** → View all friends, remove connections
2. **Requests Page** → Accept/reject received requests, cancel sent ones

### 5. View Profiles
1. Click on any user to see their profile
2. View mutual friends and connection details
3. Add/remove friends from profile page

## Build for Production

```bash
npm run build
```

This creates:
- `backend/` - Ready for server deployment
- `frontend/dist/` - Static files for CDN/hosting

## Deployment

### Backend (Heroku/Railway/Render)
```bash
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
```

Deploy the `dist` folder.

## Environment Variables Reference

**Backend:**
| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| PORT | No | 5000 | 5000 |
| MONGODB_URI | Yes | - | mongodb://localhost:27017/social-network |
| JWT_SECRET | Yes | - | your_secret_key_min_32_chars |
| NODE_ENV | No | development | development/production |

**Frontend:**
| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| VITE_API_URL | No | http://localhost:5000/api | https://api.example.com/api |

## Troubleshooting

### "Cannot GET /api/..."
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env

### "Connection refused to MongoDB"
- Start MongoDB with `mongod`
- Verify MONGODB_URI in backend/.env

### "Invalid token" on protected routes
- Clear localStorage: DevTools → Application → Local Storage → Clear
- Login again

### CORS errors
- Ensure backend runs on `http://localhost:5000`
- Frontend on `http://localhost:5173`
- CORS configured in server.js

## Performance Notes

- Recommendations use in-memory traversal (suitable for networks up to 10k users)
- For larger datasets, consider caching or Neo4j
- MongoDB indexing on `email` and `sender+receiver` for friend requests

## Future Enhancements

- User profile pictures upload
- Real-time notifications with WebSockets
- Recommendation caching
- Advanced filtering (e.g., by interests/tags)
- Batch friend request import
- Friend groups/circles
- Activity feed
- Message system

## License

MIT

## Support

For issues or questions, create an issue in the repository.

---

**Built with ❤️ using MERN Stack**

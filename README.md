# Walksy - Walk. Help. Earn.

Walksy is a MERN stack application connecting daily walkers with nearby people who need small errands completed.

## 🚀 Technogies

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Shadcn UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT, Bcrypt
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📂 Project Structure

```
/
├── frontend/           # Frontend (React + Vite)
│   ├── src/            # React source code
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Auth Context
│   │   ├── pages/      # App Pages (Home, Tasks, Auth)
│   │   ├── services/   # API Service
│   │   └── App.jsx     # Main Component & Routing
│   ├── public/         # Static assets
│   ├── index.html      # HTML entry point
│   └── ...config files # Vite, Tailwind, ESLint configs
├── backend/            # Backend API (Express + MongoDB)
│   ├── config/         # DB Connection
│   ├── controllers/    # Request Handlers
│   ├── middleware/     # Auth & Error Handling
│   ├── models/         # Mongoose Schemas (User, Task)
│   ├── routes/         # API Routes
│   ├── utils/          # Helpers
│   └── server.js       # Entry Point
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### 1. Clone & Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

**Frontend (`frontend/.env.local`):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (`backend/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/walksy 
# Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_123
```

### 3. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
# In a new terminal
cd frontend
npm run dev
```

Open `http://localhost:5173` to view the app.

## 📦 Deployment Guide

### Backend (Render / Railway)
1. Push `backend/` to a Git repo (or use root with build command).
2. Set Build Command: `npm install`
3. Set Start Command: `node server.js`
4. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).

### Frontend (Vercel / Netlify)
1. Push root to Git repo.
2. Set Build Command: `vite build` or `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variable: `VITE_API_URL` pointing to your deployed backend URL.

## 🧪 API Endpoints

- **Auth**: `POST /api/users`, `POST /api/users/login`
- **Tasks**: `POST /api/tasks`, `GET /api/tasks/nearby`, `PUT /api/tasks/:id/accept`
- **Transactions**: `GET /api/transactions`

## 🎨 Features implemented
- ✅ User Authentication (Walker/Requester)
- ✅ Location-based Task Discovery
- ✅ Task Accept/Completion Flow (Simulated)
- ✅ Dashboard with User Stats

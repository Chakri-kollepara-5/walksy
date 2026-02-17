# Walksy Backend API

Express.js + MongoDB backend for the Walksy application.

## Tech Stack

- Node.js
- Express.js v5
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/walksy
# Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_123
```

3. Run the server:
```bash
npm start
```

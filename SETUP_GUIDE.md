
# LMS Project Setup & Run Guide

## Prerequisites
- Node.js (v14+) and npm installed
- MongoDB installed and running locally OR MongoDB Atlas connection string

## Step 1: Install Dependencies

From the root directory, run:
```bash
npm run install-all
```

This will install both backend and frontend dependencies.

## Step 2: Configure Environment

Create a `.env` file in the `backend/` directory (already created with defaults):
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/lms_project
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
Replace `MONGO_URI` with:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_project
```

## Step 3: Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
No action needed, cloud-hosted.

## Step 4: Run the Application

From the root directory:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

## Step 5: Test Login & Registration

1. Go to http://localhost:5173/register
2. Create an account with:
   - Name: Test User
   - Email: test@gmail.com
   - Password: 123456
   - Role: Student

3. You'll be redirected to the dashboard after successful registration
4. Click "Sign In" on any page to test login

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running locally (`mongod` command)
- Or update `.env` with MongoDB Atlas connection string

### "JWT_SECRET is undefined"
- Check `.env` file exists in backend directory
- Restart the backend server

### "Port 3000 already in use"
- Change PORT in `.env` to another port (e.g., 3001)

### Frontend not loading?
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend dev server

## Available Roles After Login
- **Student**: Browse courses, take quizzes, view progress
- **Instructor**: Create courses, manage lessons
- **Admin**: Manage users, system overview

## Key Features Fixed
✅ Registration and login working properly
✅ JWT authentication with secure tokens
✅ Role-based dashboards
✅ User data persistence
✅ Protected routes

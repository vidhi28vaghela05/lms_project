
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

## Step 3b: Seed Database (NEW - REQUIRED)

Before running the application, you must seed the database with test users:

```bash
cd backend
npm run seed
```

This will create 3 test users:
- **Student** - student@lms.com / password123
- **Instructor** - instructor@lms.com / password123  
- **Admin** - admin@lms.com / admin123

You can now use these credentials to login.

## Step 4: Run the Application

From the root directory:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

## Step 5: Test Login & Registration

### Option A - Login with Test Users (Recommended):
Use the seeded test credentials:
1. Go to http://localhost:5173/login
2. Enter one of the test credentials:
   - **Student Login:** student@lms.com / password123
   - **Instructor Login:** instructor@lms.com / password123
   - **Admin Login:** admin@lms.com / admin123
3. You'll be redirected to the respective dashboard

### Option B - Register New User:
1. Go to http://localhost:5173/register
2. Create an account with:
   - Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
   - Role: Choose from Student, Instructor, or Admin
3. You'll be redirected to the dashboard after successful registration
4. This new user will be saved to MongoDB for future logins

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running locally (`mongod` command)
- Or update `.env` with MongoDB Atlas connection string
- Verify `MONGO_URI` in `.env` is correct

### "No users found / Login fails"
- Run the seeding script: `cd backend && npm run seed`
- This creates test users in the database
- If you deleted users, run seed again to recreate them

### "JWT_SECRET is undefined"
- Check `.env` file exists in backend directory
- Restart the backend server
- Ensure the file has `JWT_SECRET` defined

### "Port 3000 already in use"
- Change PORT in `.env` to another port (e.g., 3001)
- Or use: `netstat -ano | findstr :3000` to find the process using it

### "Frontend not loading?"
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend dev server
- Check that both backend and frontend are running

### "Data not persisting after registration"
- Verify MongoDB is running: `tasklist | findstr mongod`
- Check `.env` file has correct `MONGO_URI`
- Check browser console for API errors
- Run: `cd backend && node -e "require('./config/db')().then(() => process.exit(0))"`

## Key Features Fixed
✅ **MongoDB Integration** - Database now stores and retrieves user data
✅ Registration and login working properly with database persistence
✅ JWT authentication with secure tokens
✅ Role-based dashboards (Student, Instructor, Admin)
✅ User data persists in MongoDB between sessions
✅ Protected routes with role-based access control
✅ Test users seeded for immediate testing

## Quick Start
```bash
# 1. Install dependencies
npm run install-all

# 2. Make sure MongoDB is running (mongod command)

# 3. Seed test data
cd backend && npm run seed

# 4. Start the application
cd .. && npm run dev

# 5. Login with test credentials at http://localhost:5173/login
# Student:    student@lms.com / password123
# Instructor: instructor@lms.com / password123
# Admin:      admin@lms.com / admin123
```

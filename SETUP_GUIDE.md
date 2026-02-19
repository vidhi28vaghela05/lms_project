# LMS Project Setup & Run Guide

## 🚀 Quick Start (ONE COMMAND)

### Prerequisites
- Node.js (v14+) and npm installed
- MongoDB installed and running locally

### Run Everything with One Command:
```bash
npm run dev-complete
```

This single command will:
- ✅ Check if MongoDB is running
- ✅ Seed the database with test users
- ✅ Start the backend (port 3000)
- ✅ Start the frontend (port 5173)
- ✅ Automatically open your browser

**That's it!** Your application is ready to use.

---

## 📋 Alternative Setup (Manual)

If you prefer to start services separately:

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Seed database and start backend
cd backend
npm run seed
npm start

# Terminal 3: Start frontend
cd frontend
npm run dev
```

Then open your browser to: **http://localhost:3000**

---

## ⚙️ Configuration (Optional)

By default, everything is pre-configured. If you need to customize:

### Backend Configuration
Create a `.env` file in the `backend/` directory:
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

---

## 🎯 Features

### Student Dashboard
- Browse courses
- Take quizzes
- Track progress
- View skill graph

### Instructor Dashboard
- Create courses
- Manage lessons
- Create quizzes
- Track student enrollment

### Admin Dashboard
- Manage users
- System overview
- User analytics

---

## 🔐 Login & Registration

### Test Credentials (Pre-seeded)
After running `npm run dev-complete`, use these to login:
- **Student:** `student@lms.com` / `password123`
- **Instructor:** `instructor@lms.com` / `password123`
- **Admin:** `admin@lms.com` / `admin123`

### Register New Users
1. Click "Initialize Identity" link on login page
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Role (Student, Instructor, or Admin)
3. Click "Get Started"
4. You'll be logged in and redirected to your dashboard

All registered users are automatically saved to MongoDB and can login anytime.

---

## ❌ Troubleshooting

### "MongoDB is not running" Warning
**Problem:** Application starts but warns about MongoDB
**Solution:** 
- Start MongoDB with: `mongod`
- Or install MongoDB from: https://docs.mongodb.com/manual/installation/

### Login/Registration Fails
**Problem:** Cannot login or register with error message
**Solution:**
- Check browser console (F12) for detailed errors
- Ensure MongoDB is running (`tasklist | findstr mongod`)
- Verify database is seeded: `cd backend && npm run seed`
- Restart backend and frontend

### "Email already exists" Error on Registration
**Problem:** Cannot register with email that was previously used
**Solution:**
- This is expected - each email can only be used once
- Register with a different email address

### Frontend not loading
**Problem:** Browser shows blank page or error
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend dev server
- Check that backend is running (should see messages on port 3000)
- Open browser console (F12) to check for errors

### "Port 3000 already in use" Error
**Problem:** Cannot start backend due to port conflict
**Solution:**
- Option A: Close other application using port 3000
- Option B: Change PORT in `backend/.env` to different port (e.g., 3001)
- Option C: Kill process using port: `taskkill /F /IM node.exe`

### "Cannot connect to MongoDB" Error
**Problem:** Backend cannot connect to MongoDB
**Solution:**
- Verify MongoDB is running: `tasklist | findstr mongod`
- Check MONGO_URI in `backend/.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted
- Try restarting MongoDB

### Data not persisting after registration
**Problem:** New user registration appears to work but data doesn't persist
**Solution:**
- Check MongoDB is running
- Verify `.env` file has correct `MONGO_URI`
- Check browser Network tab (F12) to see if registration request succeeded
- Check browser Console (F12) for error details

---

## 🛠️ Troubleshooting Commands

```bash
# Check if MongoDB is running
tasklist | findstr mongod

# Re-seed database with test users
cd backend && npm run seed

# Verify database has users
cd backend && node debug.js

# Test login API from command line
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@lms.com","password":"password123"}'

# Check what's running on port 3000
netstat -ano | findstr :3000
```

---

## 📁 Project Structure

```
lms_project/
├── startup.js              # One-command startup script ← USE THIS!
├── package.json            # Root dependencies
│
├── frontend/               # React frontend (port 5173)
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboards
│   │   ├── components/    # Reusable components
│   │   ├── context/       # AuthContext for auth state
│   │   └── services/      # API service (api.js)
│   └── package.json
│
├── backend/                # Express backend (port 3000)
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seeding
│   ├── debug.js           # Database verification
│   ├── verify-login.js    # Login verification
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Auth middleware
│   ├── config/            # Database config
│   └── package.json
│
└── SETUP_GUIDE.md         # This file
```

---

## 📚 Available npm Scripts

### Root Directory
```bash
npm run dev-complete    # Start everything with one command! ⭐
npm run dev             # Start backend + frontend only
npm run install-all     # Install all dependencies
npm run build           # Build frontend for production
npm start               # Start backend only
```

### Backend Directory
```bash
npm start               # Start backend server
npm run seed            # Seed database with test users
npm run dev             # Same as start
```

### Frontend Directory
```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## ✅ Verification Checklist

After running `npm run dev-complete`:

- [ ] Browser opens automatically to http://localhost:3000
- [ ] See login page
- [ ] Can login with `student@lms.com` / `password123`
- [ ] Redirected to student dashboard
- [ ] Browser shows URL as http://localhost:3000 (backend serves frontend)
- [ ] Can click logout
- [ ] Can access registration page
- [ ] Can register new user with new email

---

## 🆘 Need Help?

If you're still having issues:

1. **Check error messages** in browser console (F12)
2. **Check terminal output** for backend/frontend errors
3. **Verify all services are running:**
   - MongoDB: `tasklist | findstr mongod`
   - Backend: Should show "Server running on port 3000"
   - Frontend: Should show "Local: http://localhost:5173"
4. **Try the debug commands** above to test each component
5. **Restart everything** - sometimes services get stuck
6. **Clear cache** - browser cache can cause issues

---

## 📝 Quick Reference

| What | Where | How |
|------|-------|-----|
| Start everything | Root directory | `npm run dev-complete` |
| Login page | Browser | http://localhost:3000/login |
| Register page | Browser | http://localhost:3000/register |
| Backend API | Port | 3000 |
| Frontend Dev Server | Port | 5173 |
| MongoDB | Port | 27017 |
| Test User (Student) | Email | student@lms.com |
| Test User (Instructor) | Email | instructor@lms.com |
| Test User (Admin) | Email | admin@lms.com |
| Test User (All) | Password | password123 (or admin123 for admin) |

---

## 🎓 Getting Started

1. **First time?** Run: `npm run dev-complete`
2. **Login page loads** → Enter `student@lms.com` / `password123`
3. **Dashboard loads** → You're logged in!
4. **Want to test registration?** Click "Initialize Identity"
5. **Want to try another role?** Logout and login with different test credentials

Enjoy the LMS Ecosystem! 🚀

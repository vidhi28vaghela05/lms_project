const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/admin', require('./routes/admin'));

// Serve Frontend Static Files
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Handle React Routing
app.use((req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

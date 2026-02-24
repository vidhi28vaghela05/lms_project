process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Try root .env first, fall back to backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ' + mongoose.connection.host);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

console.log('Loaded middleware');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));



console.log('Loaded routes');

// Serve Frontend in Production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Handle React Routing
app.use((req, res) => {
  if (!req.url.startsWith('/api')) {
    const indexPath = path.join(frontendBuildPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send(err.message);
      }
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('ERROR HANDLER:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Socket.io Logic
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} registered and online`);
    
    // Notify others that this user is online
    io.emit('userStatus', { userId, status: 'online' });
  });

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation room: ${conversationId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, senderId, text, messageType, fileUrl, fileName } = data;
      
      const newMessage = await Message.create({ 
        conversationId,
        sender: senderId, 
        message: text,
        messageType: messageType || 'text',
        fileUrl,
        fileName,
        status: 'sent'
      });

      // Update conversation last message and unread counts
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { 
          lastMessage: newMessage._id,
          $inc: { 'unreadCounts.$[elem].count': 1 }
        },
        { 
          arrayFilters: [{ 'elem.user': { $ne: senderId } }],
          new: true 
        }
      );

      // Emit to the conversation room
      io.to(conversationId).emit('receiveMessage', newMessage);

      // Also emit update to conversation list for all participants
      conversation.participants.forEach(participantId => {
        io.to(participantId.toString()).emit('conversationUpdate', conversation);
      });

    } catch (error) {
      console.error('Socket sendMessage error:', error.message);
    }
  });

  socket.on('typing', (data) => {
    const { conversationId, userId, userName } = data;
    socket.to(conversationId).emit('userTyping', { conversationId, userId, userName });
  });

  socket.on('stopTyping', (data) => {
    const { conversationId, userId } = data;
    socket.to(conversationId).emit('userStoppedTyping', { conversationId, userId });
  });

  socket.on('markAsRead', async (data) => {
    const { conversationId, userId } = data;
    try {
      await Message.updateMany(
        { conversationId, sender: { $ne: userId }, 'readBy.user': { $ne: userId } },
        { $push: { readBy: { user: userId } }, status: 'read' }
      );
      
      await Conversation.updateOne(
        { _id: conversationId, 'unreadCounts.user': userId },
        { $set: { 'unreadCounts.$.count': 0 } }
      );

      io.to(conversationId).emit('messagesRead', { conversationId, userId });
    } catch (err) {
      console.error('Mark as read error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('userStatus', { userId: socket.userId, status: 'offline' });
      console.log(`User ${socket.userId} offline`);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

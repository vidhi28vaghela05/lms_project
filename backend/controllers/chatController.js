const Message = require('../models/Message');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Get available chat partners based on role
exports.getChatPartners = async (req, res) => {
  try {
    const { role, id } = req.user;
    let partners = [];

    if (role === 'student') {
      // Students can chat with their instructors and admins
      const enrollments = await Enrollment.find({ userId: id }).populate({
        path: 'courseId',
        populate: { path: 'instructorId', select: 'name email avatar role' }
      });
      
      const instructors = enrollments.map(e => e.courseId.instructorId).filter(Boolean);
      const admins = await User.find({ role: 'admin' }).select('name email avatar role');
      
      // Merge and remove duplicates
      const uniqueInstructors = Array.from(new Map(instructors.map(i => [i._id.toString(), i])).values());
      partners = [...uniqueInstructors, ...admins];

    } else if (role === 'instructor') {
      // Instructors can chat with their students and admins
      const courses = await Course.find({ instructorId: id });
      const courseIds = courses.map(c => c._id);
      
      const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).populate('userId', 'name email avatar role');
      const students = enrollments.map(e => e.userId).filter(Boolean);
      const admins = await User.find({ role: 'admin' }).select('name email avatar role');
      
      const uniqueStudents = Array.from(new Map(students.map(s => [s._id.toString(), s])).values());
      partners = [...uniqueStudents, ...admins];

    } else if (role === 'admin') {
      // Admins can chat with everyone
      partners = await User.find({ _id: { $ne: id } }).select('name email avatar role');
    }

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name email avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or get one-to-one conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user.id, participantId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, participantId],
        unreadCounts: [
          { user: req.user.id, count: 0 },
          { user: participantId, count: 0 }
        ]
      });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get message history for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for this user
    await Message.updateMany(
      { 
        conversationId, 
        sender: { $ne: req.user.id },
        'readBy.user': { $ne: req.user.id }
      },
      { 
        $push: { readBy: { user: req.user.id } },
        status: 'read'
      }
    );

    // Reset unread count
    await Conversation.updateOne(
      { _id: conversationId, 'unreadCounts.user': req.user.id },
      { $set: { 'unreadCounts.$.count': 0 } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a group conversation
exports.createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const allParticipants = [...new Set([...participants, req.user.id])];
    
    const unreadCounts = allParticipants.map(userId => ({
      user: userId,
      count: 0
    }));

    const conversation = await Conversation.create({
      isGroup: true,
      groupName: name,
      participants: allParticipants,
      unreadCounts
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

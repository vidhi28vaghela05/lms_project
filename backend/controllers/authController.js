const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const svgCaptcha = require('svg-captcha');
const { sendOTP, sendResetPasswordLink } = require('../utils/emailService');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Stateless Captcha: Encrypt text in a JWT-like token
exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    background: '#f0f2f5'
  });
  
  // Create a short-lived token containing the captcha text
  const captchaToken = jwt.sign(
    { text: captcha.text.toLowerCase() }, 
    process.env.JWT_SECRET, 
    { expiresIn: '5m' }
  );

  res.json({
    data: captcha.data, // SVG string
    token: captchaToken
  });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { 
      name, email, password, role, 
      registrationDescription, upiId, 
      captcha, captchaToken 
    } = req.body;

    if (!name || !email || !password || !captcha || !captchaToken) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Captcha Token
    try {
      const decoded = jwt.verify(captchaToken, process.env.JWT_SECRET);
      if (decoded.text !== captcha.toLowerCase()) {
        return res.status(400).json({ message: 'Invalid Captcha code' });
      }
    } catch (err) {
      return res.status(400).json({ message: 'Captcha expired, please refresh' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role,
      registrationDescription,
      upiId,
      isVerified: true // Auto-verify with correct captcha
    });

    console.log('\n======================================');
    console.log('🚀 NEW USER REGISTERED (CAPTCHA VERIFIED)');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Role: ${role}`);
    console.log('======================================\n');

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// verifyOTP and resendOTP removed as they are replaced by Captcha-based auto-verification during registration.

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password, captcha, captchaToken, role } = req.body;
    if (!email || !password || !captcha || !captchaToken) {
      return res.status(400).json({ message: 'Please provide email, password, and captcha' });
    }

    // Verify Captcha Token
    try {
      const decoded = jwt.verify(captchaToken, process.env.JWT_SECRET);
      if (decoded.text !== captcha.toLowerCase()) {
        return res.status(400).json({ message: 'Invalid Captcha code' });
      }
    } catch (err) {
      return res.status(400).json({ message: 'Captcha expired, please refresh' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Access Denied: You are not registered as a ${role}` });
    }

    if (user.role === 'instructor' && user.status !== 'approved') {
      return res.status(403).json({ 
        message: `Your instructor account is ${user.status}. Please wait for admin approval.`,
        status: user.status
      });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await sendResetPasswordLink(email, resetUrl);

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

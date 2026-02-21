const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"LMS 3.0" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    console.log('--- DEVELOPMENT MODE: OTP/LINK LOG ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', html.replace(/<[^>]*>/g, '').trim()); // Strip HTML for console
    console.log('--------------------------------------');
    return true; // Return true to allow registration flow to continue in dev
  }
};

const sendOTP = async (email, otp) => {
  const subject = 'Verification Code - LMS 3.0';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #e63946;">Email Verification</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #1d3557; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendResetPasswordLink = async (email, link) => {
  const subject = 'Password Reset Request - LMS 3.0';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #e63946;">Password Reset</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #e63946; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>If the button doesn't work, copy and paste this link in your browser:</p>
      <p>${link}</p>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

module.exports = { sendOTP, sendResetPasswordLink };

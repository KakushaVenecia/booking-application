const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeCrypto = require('crypto');
const nodemailer = require('nodemailer');


exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // ✅ Restrict email domain
    const allowedDomain = 'centreforwomensjustice.org.uk';
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (emailDomain !== allowedDomain) {
      return res.status(400).json({ message: 'Invalid email provided.'});
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = new User({
      email,
      username,
      passwordHash,
      // 2FA fields can be added later, like:
      // twoFactorEnabled: false,
      // twoFactorSecret: null
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //to change this on deployment
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',  // Change this to 'Lax' for localhost/dev
      secure: false,    // Keep false for localhost
      maxAge: 3600000,
    });


    res.status(200).json({ message: 'Login successful'});

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });

      
    const token = nodeCrypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      html: `<p>Click below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.status(200).json({ message: 'Reset link sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

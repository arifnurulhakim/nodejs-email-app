const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto'); // Untuk membuat token
const nodemailer = require('nodemailer'); // Untuk mengirim email


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // Set true jika menggunakan port 465
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Fungsi untuk mengirim email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject,
    text,
  };
  
  await transporter.sendMail(mailOptions);
};

// Mengambil semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users',  error: error.message });
  }
};

// Mengambil pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user',  error: error.message });
  }
};

// Membuat pengguna baru
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user',  error: error.message });
  }
};

// Memperbarui pengguna
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await User.getById(id);
    if (user) {
      const updatedUser = { username };
      const updatedEmail = { email };
      if (password) {
        updatedUser.password = await bcrypt.hash(password, 10);
      }
      await User.update(id, updatedUser, updatedEmail);
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user',  error: error.message });
  }
};

// Menghapus pengguna
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      await User.delete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user',  error: error.message });
  }
};

// Login dan menghasilkan JWT
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = (await User.getByAll()).find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        status: 'success',
        message: 'login has been successful',
        data: {
          username: user.username,
          email: user.email,
          token,
          exp: 3600 // Expiration time in seconds (1 hour)
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in',  error: error.message });
  }
};

// Registrasi pengguna
exports.register = async (req, res) => {
  const { username,email, password } = req.body;
  try {
    const users = await User.getAll();
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      status: 'success',
      message: 'user has been created',
      data: {
        username: username,
        email: email,
        token,
        exp: 3600 // Expiration time in seconds (1 hour)
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registering user',  error: error.message });
  }
};

// Middleware untuk memverifikasi JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = (await User.getByAll()).find(u => u.email === email);
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 jam dari sekarang

    await User.setResetToken(user.id, verificationCode, resetTokenExpires);

    // Kirim email dengan kode verifikasi
    await sendEmail(email, 'Reset Password', `Your verification code is: ${verificationCode}`);

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification code', error: error.message });

  }
};

// Mengatur ulang password dengan kode verifikasi
exports.resetPassword = async (req, res) => {
  const { verificationCode, newPassword } = req.body;
  try {
 
    const user = (await User.getByAll()).find(u => u.reset_token === verificationCode);
 
    if (!user || !user.reset_token_expires || new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(user.id, { password: hashedPassword });
    await User.clearResetToken(user.id); // Menghapus token reset

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification code', error: error.message });
  }
};


const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };
  
  await transporter.sendMail(mailOptions);
};

// Login dengan email
exports.loginWithEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP dan waktu kedaluwarsa
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 menit dari sekarang

    await User.saveOtp(user.id, otp, otpExpires);
    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verifikasi OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.getByEmail(email);
    if (!user || !user.otp || !user.otp_expires) {
      return res.status(404).json({ message: 'User not found or OTP not generated' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Periksa apakah OTP masih berlaku
    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hapus OTP setelah berhasil diverifikasi
    await User.clearOtp(user.id);

    // Buat token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Sesuaikan waktu kedaluwarsa token sesuai kebutuhan
    });

    res.status(200).json({
      status: 'success',
      message: 'Login has been successful',
      data: {
        username: user.username,
        email: user.email,
        token,
        exp: 3600, // Waktu kedaluwarsa dalam detik (1 jam)
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};


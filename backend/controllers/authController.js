const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

//Register a new user
exports.register = async (req, res) => {
  const {email, password, role } = req.body;

  try {
    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // If role is student, validate against student table
    if (role === 'student') {
      const [student] = await db.query('SELECT * FROM student WHERE email = ?', [email]);

      if (student.length === 0) {
        return res.status(403).json({ message: 'Email not found in student records' });
      }

      
    }

    // Proceed to hash password and register
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login function
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `${role} account not found for this email.` });
    }

    // ✅ generate token or session here if needed
    res.status(200).json({
  message: 'Login successful',
  email: user.email,
  role: user.role,
  id: user.id // or user._id depending on your DB
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
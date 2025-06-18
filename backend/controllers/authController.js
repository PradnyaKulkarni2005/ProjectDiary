const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // If role is student, validate against student table
    if (role === 'student') {
      const student = await db.query('SELECT * FROM student WHERE email = $1', [email]);
      if (student.rows.length === 0) {
        return res.status(403).json({ message: 'Email not found in student records' });
      }
    }
    if(role == 'Coordinator'){
      const coordinator = await db.query('SELECT * FROM coordinators WHERE email = $1', [email]);
      if(coordinator.rows.length === 0){
        return res.status(403).json({ message: 'Email not found in coordinator records' });
      }
    }

    // Proceed to hash password and register
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
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
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

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
      id: user.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// This is the main server file for the ProjectDiary application
// It sets up the Express server and connects to the Mysql database
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
// Middleware to handle JSON requests

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

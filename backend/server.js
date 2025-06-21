// 🔥 Handle uncaught exceptions & promise rejections
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error(err.stack);
});

// 🌐 Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// 📦 Routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const coordNotificationRoutes = require('./routes/coordNotificationRoutes');
const activityRoutes = require('./routes/activityRoutes');

// 🌍 Middleware
app.use(cors());
app.use(express.json());

// 🚦 API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', coordNotificationRoutes);
app.use('/api/activities', activityRoutes);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

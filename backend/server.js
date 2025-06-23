// 🔥 Handle uncaught exceptions & promise rejections
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
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
const pool = require('./config/db');

// 📦 Routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const coordNotificationRoutes = require('./routes/coordNotificationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const spotlightRoutes = require('./routes/spotlightRoutes');

// 🌍 Middleware
app.use(cors());
app.use(express.json());

// 🚦 API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', coordNotificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/spotlight', spotlightRoutes);

// ✅ Health Check Route
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1'); // Simple DB query
    res.status(200).send('✅ Server & DB Healthy');
  } catch (err) {
    console.error('❌ Health Check Failed:', err.message);
    res.status(500).send('DB Connection Error');
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// 🔌 Graceful Shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  try {
    server.close(async () => {
      await pool.end();
      console.log('✅ PostgreSQL pool closed.');
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Error during shutdown:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

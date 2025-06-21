const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotificationsForUser,
  getUsersByRole,
  getSentNotifications,
  deleteNotification 
} = require('../controllers/notificationController');

// ⛳️ Specific routes first
router.get('/users-by-role', getUsersByRole);
router.post('/send', sendNotification);
router.get('/sent/:senderId', getSentNotifications);       // ✅ specific
router.delete('/delete/:id', deleteNotification);

// ⛳️ Dynamic route LAST
router.get('/:receiverId', getNotificationsForUser);

module.exports = router;

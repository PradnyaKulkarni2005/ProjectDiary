const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotificationsForUser,
  getUsersByRole
} = require('../controllers/notificationController');

// ⛳️ Make sure this is above the dynamic param route
router.get('/users-by-role', getUsersByRole);
router.post('/send', sendNotification);
router.get('/:receiverId', getNotificationsForUser);

module.exports = router;

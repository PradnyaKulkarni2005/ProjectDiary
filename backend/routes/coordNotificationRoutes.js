const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotificationsForUser,
  getUsersByRole,
   getSentNotifications,     // ⬅️ NEW
  deleteNotification 
} = require('../controllers/notificationController');

// ⛳️ Make sure this is above the dynamic param route
router.get('/users-by-role', getUsersByRole);
router.post('/send', sendNotification);
router.get('/:receiverId', getNotificationsForUser);
router.get('/sent/:senderId', getSentNotifications);       // ⬅️ GET all sent notifications
router.delete('/delete/:id', deleteNotification); 

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getGuidesByStudentUserId,
  getGuideInvites,
  respondToInvite
} = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/by-department/:userId', getGuidesByStudentUserId);
router.get('/invites', protect, getGuideInvites); // ✅ added protect
router.post('/respond-invite', protect, respondToInvite); // also protect if needed

module.exports = router;

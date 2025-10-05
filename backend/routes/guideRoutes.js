const express = require('express');
const router = express.Router();
const {
  getGuidesByStudentUserId,
  getGuideInvites,
  respondToInvite,
  getGroupReviews,
  addReviewAssessment,
  updateReviewAssessment,getMyGroups
} = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/by-department/:userId', getGuidesByStudentUserId);
router.get('/invites', protect, getGuideInvites); // added protect
router.post('/respond-invite', protect, respondToInvite); // also protect if needed
router.get('/my-groups', protect, getMyGroups); // guide fetches their groups
router.get("/reviews/:groupId", protect, getGroupReviews); // student fetches own reviews

router.post('/reviews', protect, addReviewAssessment); // guide adds
router.put('/reviews/:id', protect, updateReviewAssessment); // guide updates

module.exports = router;

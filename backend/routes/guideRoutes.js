const express = require('express');
const router = express.Router();
const {
  getGuidesByStudentUserId,
  getGuideInvites,
  respondToInvite,
  getGroupReviews,
  addReviewAssessment,
  updateReviewAssessment,
  getMyGroups,
  getActivitySheetsByGroup
} = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/by-department/:userId', getGuidesByStudentUserId);
router.get('/invites', protect, getGuideInvites); // added protect
router.post('/respond-invite', protect, respondToInvite); // also protect if needed
router.get('/my-groups', protect, getMyGroups); // guide fetches their groups
router.get("/reviews/:groupId", protect, getGroupReviews); // guide and student fetches the reviews

router.post('/reviews', protect, addReviewAssessment); // guide adds
router.put('/reviews/:id', protect, updateReviewAssessment); // guide updates
router.get("/groups/:groupId/activity-sheets", protect, getActivitySheetsByGroup); // guide fetches activity sheets for a group
module.exports = router;

const express = require('express');
const router = express.Router();
const { getGuidesByStudentUserId } = require('../controllers/guideController');

router.get('/by-department/:userId', getGuidesByStudentUserId);
module.exports = router;
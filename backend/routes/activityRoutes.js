const express = require('express');
const router = express.Router();
const {submitActivitySheet,getProjectGroup,getActivitySheet} = require('../controllers/activityController');
const {protect} = require('../middleware/authMiddleware');

router.post('/submit', submitActivitySheet);
router.get('/group/:groupid', getProjectGroup);
router.get('/sheet/:sheetId',protect, getActivitySheet);

module.exports = router;
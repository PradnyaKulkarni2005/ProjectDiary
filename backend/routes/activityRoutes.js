const express = require('express');
const router = express.Router();
const {submitActivitySheet,getProjectGroup,getActivitySheet,submitPatentDetails} = require('../controllers/activityController');
const {protect} = require('../middleware/authMiddleware');

router.post('/submit', submitActivitySheet);
router.get('/group/:groupid', getProjectGroup);
router.get('/sheet/:sheetId',protect, getActivitySheet);
router.post('/subpatent',submitPatentDetails);

module.exports = router;
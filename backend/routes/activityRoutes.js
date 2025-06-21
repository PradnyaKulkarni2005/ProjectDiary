const express = require('express');
const router = express.Router();
const submitActivitySheet = require('../controllers/activityController');
router.post('/submit', submitActivitySheet);

module.exports = router;
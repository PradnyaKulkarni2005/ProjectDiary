const express = require('express');
const router = express.Router();
const { getGuidesByDepartment } = require('../controllers/guideController');

router.get('/', getGuidesByDepartment);
const express = require('express');
const router = express.Router();
const {
  updateSpotlight,
  getValidSpotlights
} = require('../controllers/spotlightController');

router.post('/', updateSpotlight); // POST /api/spotlight
router.get('/valid', getValidSpotlights); // GET /api/spotlight/valid

module.exports = router;

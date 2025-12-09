const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.getSales);
router.get('/meta', salesController.getMetadata); // For filter options (unique regions, categories, etc if needed)

module.exports = router;

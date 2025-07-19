const express = require('express');
const router = express.Router();
const { submitResponse, getResponses } = require('../controllers/responseController');
const { protect } = require('../middlewares/authMiddleware');
const { getAnalytics, exportCSV } = require('../controllers/responseController');

router.post('/:formId', submitResponse); // public route
router.get('/:formId', protect, getResponses); // admin only
router.get('/:formId/analytics', protect, getAnalytics);
router.get('/:formId/export', protect, exportCSV);
router.get("/:formId/raw", protect, getRawResponses);



module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createForm,
  getFormBySlug,
  suggestQuestions,
  getFormsByAdmin
} = require('../controllers/formController');

router.post('/create', protect, createForm);
router.get('/:slug', getFormBySlug);
router.post('/suggest', protect, suggestQuestions);
router.get('/admin/all', protect, getFormsByAdmin);


module.exports = router;

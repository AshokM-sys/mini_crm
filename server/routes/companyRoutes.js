const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.use(protect); // All company routes require authentication

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompanyById);

module.exports = router;

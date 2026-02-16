const express = require('express');
const router = express.Router();
const { getUserTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserTransactions);

module.exports = router;

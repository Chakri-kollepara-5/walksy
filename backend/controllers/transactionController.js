const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
});

module.exports = {
    getUserTransactions,
};

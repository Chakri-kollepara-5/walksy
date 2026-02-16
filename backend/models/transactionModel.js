const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Task',
        },
        amount: {
            type: Number,
            required: true,
        },
        commissionDeducted: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

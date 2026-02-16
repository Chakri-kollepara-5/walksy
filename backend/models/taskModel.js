const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        rewardAmount: { type: Number, required: true },
        commission: { type: Number, required: true },
        status: {
            type: String,
            enum: ['open', 'accepted', 'completed'],
            default: 'open',
        },
        requesterId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        walkerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], index: '2dsphere' }, // [longitude, latitude]
        },
        category: {
            type: String,
            enum: ['delivery', 'shopping', 'pickup', 'survey', 'other'],
            default: 'other',
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
        estimatedDuration: {
            type: String,
            default: '30 min',
        },
    },
    { timestamps: true }
);

taskSchema.index({ location: '2dsphere' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

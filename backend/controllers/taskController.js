const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Requester)
const createTask = asyncHandler(async (req, res) => {
    const { title, description, rewardAmount, location, category, difficulty, estimatedDuration } = req.body;

    // 15% commission
    const commission = rewardAmount * 0.15;

    const task = await Task.create({
        title,
        description,
        rewardAmount,
        commission,
        requesterId: req.user._id,
        location: location, // Expecting { type: 'Point', coordinates: [long, lat] }
        category,
        difficulty,
        estimatedDuration,
    });

    res.status(201).json(task);
});

// @desc    Get nearby open tasks
// @route   GET /api/tasks/nearby
// @access  Private (Walker)
const getNearbyTasks = asyncHandler(async (req, res) => {
    const { long, lat, distance } = req.query; // distance in meters

    const tasks = await Task.find({
        status: 'open',
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(long), parseFloat(lat)],
                },
                $maxDistance: parseInt(distance) || 5000, // Default 5km
            },
        },
    }).populate('requesterId', 'name rating');

    res.json(tasks);
});

// @desc    Accept a task
// @route   PUT /api/tasks/:id/accept
// @access  Private (Walker)
const acceptTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.status !== 'open') {
            res.status(400);
            throw new Error('Task already accepted or completed');
        }

        task.walkerId = req.user._id;
        task.status = 'accepted';
        await task.save();
        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

// @desc    Complete a task
// @route   PUT /api/tasks/:id/complete
// @access  Private (Requester - to confirm completion, or Walker with verification)
// For simplicity, letting Walker complete it for now, but in prod, Requester should confirm.
const completeTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.status !== 'accepted') {
            res.status(400);
            throw new Error('Task not in accepted state');
        }

        if (task.walkerId.toString() !== req.user._id.toString() && task.requesterId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to complete this task');
        }

        task.status = 'completed';
        await task.save();

        // Update Walker stats
        const walker = await User.findById(task.walkerId);
        walker.fitnessPoints += 10; // 10 points per task
        walker.totalEarnings += (task.rewardAmount - task.commission);
        await walker.save();

        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

module.exports = {
    createTask,
    getNearbyTasks,
    acceptTask,
    completeTask,
};

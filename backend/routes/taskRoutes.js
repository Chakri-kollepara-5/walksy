const express = require('express');
const router = express.Router();
const {
    createTask,
    getNearbyTasks,
    acceptTask,
    completeTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTask);
router.route('/nearby').get(protect, getNearbyTasks);
router.route('/:id/accept').put(protect, acceptTask);
router.route('/:id/complete').put(protect, completeTask);

module.exports = router;

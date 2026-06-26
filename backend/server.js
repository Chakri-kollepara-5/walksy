const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const User = require('./models/userModel');
const Task = require('./models/taskModel');

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/stats', async (req, res, next) => {
    try {
        // Count active walkers
        const totalWalkers = await User.countDocuments({ role: 'walker' });
        
        // Sum fitness points and total earnings from users
        const users = await User.find({}, 'fitnessPoints totalEarnings');
        let totalFitnessPoints = 0;
        let totalEarnings = 0;
        users.forEach(user => {
            totalFitnessPoints += (user.fitnessPoints || 0);
            totalEarnings += (user.totalEarnings || 0);
        });

        // Count completed tasks
        const totalTasksCompleted = await Task.countDocuments({ status: 'completed' });

        res.json({
            totalWalkers: totalWalkers || 0,
            totalFitnessPoints: totalFitnessPoints || 0,
            totalTasksCompleted: totalTasksCompleted || 0,
            totalEarnings: totalEarnings || 0
        });
    } catch (error) {
        next(error);
    }
});

app.get('/api/seed', async (req, res, next) => {
    try {
        // Clear existing mock data first to avoid duplicates
        await User.deleteMany({ email: { $in: ["rahul@walksy.app", "ananya@walksy.app", "david@walksy.app", "john@walksy.app"] } });
        
        // Find existing tasks linked to these emails and delete them
        const requester = await User.findOne({ email: "john@walksy.app" });
        if (requester) {
            await Task.deleteMany({ requesterId: requester._id });
        }

        // Create new requester
        const newRequester = await User.create({
            name: "John Doe",
            email: "john@walksy.app",
            password: "password123",
            role: "requester"
        });

        // Create new walkers with real achievements
        const walker1 = await User.create({
            name: "Rahul Kumar",
            email: "rahul@walksy.app",
            password: "password123",
            role: "walker",
            fitnessPoints: 1200,
            totalEarnings: 150
        });

        const walker2 = await User.create({
            name: "Ananya Sharma",
            email: "ananya@walksy.app",
            password: "password123",
            role: "walker",
            fitnessPoints: 2400,
            totalEarnings: 310
        });

        const walker3 = await User.create({
            name: "David Smith",
            email: "david@walksy.app",
            password: "password123",
            role: "walker",
            fitnessPoints: 850,
            totalEarnings: 95
        });

        // Create completed tasks
        await Task.create({
            title: "Quick Grocery Delivery",
            description: "Pick up milk and bread from local store",
            rewardAmount: 50,
            commission: 5,
            status: "completed",
            requesterId: newRequester._id,
            walkerId: walker1._id,
            category: "delivery",
            difficulty: "easy"
        });

        await Task.create({
            title: "Medicine Pickup",
            description: "Pick up prescription from Pharmacy",
            rewardAmount: 120,
            commission: 12,
            status: "completed",
            requesterId: newRequester._id,
            walkerId: walker2._id,
            category: "pickup",
            difficulty: "medium"
        });

        await Task.create({
            title: "Store Price Audit",
            description: "Check prices of dynamic items",
            rewardAmount: 80,
            commission: 8,
            status: "completed",
            requesterId: newRequester._id,
            walkerId: walker3._id,
            category: "survey",
            difficulty: "medium"
        });

        res.send("<h1>Database successfully seeded with original Walksy data!</h1><p>Added 3 walkers, 1 requester, and 3 completed tasks.</p><p><a href='http://localhost:8080/'>Go to Landing Page</a></p>");
    } catch (error) {
        next(error);
    }
});

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

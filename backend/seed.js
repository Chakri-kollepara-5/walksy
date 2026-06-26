const mongoose = require('mongoose');
const User = require('./models/userModel');
const Task = require('./models/taskModel');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing mock data first to avoid duplicates
        await User.deleteMany({ email: { $in: ["rahul@walksy.app", "ananya@walksy.app", "david@walksy.app", "john@walksy.app"] } });
        console.log('🧹 Cleared existing seed users');

        // Create requester
        const requester = await User.create({
            name: "John Doe",
            email: "john@walksy.app",
            password: "password123",
            role: "requester"
        });
        console.log('👤 Created requester John Doe');

        // Create walkers with real stats
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
        console.log('🏃 Created 3 walkers (Rahul, Ananya, David)');

        // Find and delete any tasks previously linked to these
        await Task.deleteMany({ requesterId: requester._id });

        // Create completed tasks
        await Task.create({
            title: "Quick Grocery Delivery",
            description: "Pick up milk and bread from local store",
            rewardAmount: 50,
            commission: 5,
            status: "completed",
            requesterId: requester._id,
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
            requesterId: requester._id,
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
            requesterId: requester._id,
            walkerId: walker3._id,
            category: "survey",
            difficulty: "medium"
        });
        console.log('✅ Created 3 completed tasks');

        await mongoose.connection.close();
        console.log('🎉 Seeding database complete!');
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
    }
};

seedDatabase();

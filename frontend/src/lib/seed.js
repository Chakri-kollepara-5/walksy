import { db } from "./firebase";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";

export const seedFirestoreData = async () => {
    try {
        console.log("Starting Firestore seeding with original Walksy data...");

        // 1. Seed Users
        const usersToSeed = [
            {
                uid: "walker_rahul",
                name: "Rahul Kumar",
                email: "rahul@walksy.app",
                role: "walker",
                createdAt: new Date(),
                totalEarnings: 150,
                totalTasksCompleted: 1,
                totalSteps: 12500,
                fitnessPoints: 1200,
                streak: 3
            },
            {
                uid: "walker_ananya",
                name: "Ananya Sharma",
                email: "ananya@walksy.app",
                role: "walker",
                createdAt: new Date(),
                totalEarnings: 310,
                totalTasksCompleted: 2,
                totalSteps: 28400,
                fitnessPoints: 2400,
                streak: 7
            },
            {
                uid: "walker_david",
                name: "David Smith",
                email: "david@walksy.app",
                role: "walker",
                createdAt: new Date(),
                totalEarnings: 95,
                totalTasksCompleted: 1,
                totalSteps: 9800,
                fitnessPoints: 850,
                streak: 1
            },
            {
                uid: "requester_john",
                name: "John Doe",
                email: "john@walksy.app",
                role: "requester",
                createdAt: new Date(),
                totalEarnings: 0,
                totalTasksCompleted: 0,
                totalSteps: 0,
                fitnessPoints: 0,
                streak: 0
            }
        ];

        for (const user of usersToSeed) {
            const { uid, ...userData } = user;
            await setDoc(doc(db, "users", uid), userData);
            console.log(`Seeded user in Firestore: ${userData.name}`);
        }

        // 2. Seed Tasks
        const tasksToSeed = [
            {
                title: "Grocery Delivery",
                description: "Pick up groceries from FreshMart and deliver to HSR Layout.",
                reward: 150,
                distance: 1.2,
                category: "delivery",
                location: { lat: 12.9121, lng: 77.6446 },
                pickupLocation: "FreshMart, HSR Layout",
                dropLocation: "HSR Layout Sector 3",
                difficulty: "easy",
                status: "open",
                createdBy: "requester_john",
                creatorName: "John Doe",
                createdAt: new Date()
            },
            {
                title: "Mystery Shopper - Starbucks",
                description: "Visit Starbucks Indiranagar, buy a coffee, and rate the service.",
                reward: 350,
                distance: 3.5,
                category: "shopping",
                location: { lat: 12.9784, lng: 77.6408 },
                pickupLocation: "Starbucks, Indiranagar",
                dropLocation: "Indiranagar 100ft Road",
                difficulty: "medium",
                status: "open",
                createdBy: "requester_john",
                creatorName: "John Doe",
                createdAt: new Date()
            },
            {
                title: "Document Pickup",
                description: "Pick up legal documents from Koramangala 4th Block.",
                reward: 200,
                distance: 2.1,
                category: "pickup",
                location: { lat: 12.9345, lng: 77.6266 },
                pickupLocation: "Koramangala 4th Block",
                dropLocation: "MG Road Metro Station",
                difficulty: "easy",
                status: "open",
                createdBy: "requester_john",
                creatorName: "John Doe",
                createdAt: new Date()
            },
            {
                title: "Park Survey",
                description: "Visit Cubbon Park and count the number of benches in sector A.",
                reward: 100,
                distance: 0.8,
                category: "survey",
                location: { lat: 12.9757, lng: 77.5929 },
                pickupLocation: "Cubbon Park Entrance",
                dropLocation: "Vithal Mallya Road",
                difficulty: "easy",
                status: "open",
                createdBy: "requester_john",
                creatorName: "John Doe",
                createdAt: new Date()
            },
            {
                title: "Medicine Delivery",
                description: "Deliver medicines to elderly patient in Jayanagar.",
                reward: 250,
                distance: 4.0,
                category: "delivery",
                location: { lat: 12.9250, lng: 77.5938 },
                pickupLocation: "Apollo Pharmacy, Jayanagar",
                dropLocation: "Jayanagar 4th T Block",
                difficulty: "medium",
                status: "open",
                createdBy: "requester_john",
                creatorName: "John Doe",
                createdAt: new Date()
            },
            {
                title: "Quick Grocery Delivery",
                description: "Pick up milk and bread from local store",
                reward: 50,
                distance: 0.5,
                category: "delivery",
                location: { lat: 12.9125, lng: 77.6441 },
                pickupLocation: "Local Store",
                dropLocation: "HSR Layout Sector 1",
                difficulty: "easy",
                status: "completed",
                createdBy: "requester_john",
                creatorName: "John Doe",
                walkerId: "walker_rahul",
                walkerName: "Rahul Kumar",
                createdAt: new Date()
            },
            {
                title: "Medicine Pickup",
                description: "Pick up prescription from Pharmacy",
                reward: 120,
                distance: 1.5,
                category: "pickup",
                location: { lat: 12.9248, lng: 77.5930 },
                pickupLocation: "Jayanagar Pharmacy",
                dropLocation: "Jayanagar 3rd Block",
                difficulty: "medium",
                status: "completed",
                createdBy: "requester_john",
                creatorName: "John Doe",
                walkerId: "walker_ananya",
                walkerName: "Ananya Sharma",
                createdAt: new Date()
            },
            {
                title: "Store Price Audit",
                description: "Check prices of dynamic items",
                reward: 80,
                distance: 2.0,
                category: "survey",
                location: { lat: 12.9340, lng: 77.6260 },
                pickupLocation: "Target Store",
                dropLocation: "Koramangala 1st Block",
                difficulty: "medium",
                status: "completed",
                createdBy: "requester_john",
                creatorName: "John Doe",
                walkerId: "walker_david",
                walkerName: "David Smith",
                createdAt: new Date()
            }
        ];

        const tasksCollection = collection(db, "tasks");
        for (const task of tasksToSeed) {
            await addDoc(tasksCollection, task);
            console.log(`Seeded task in Firestore: ${task.title}`);
        }

        console.log("Firestore seeding completed successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding Firestore data:", error);
        return false;
    }
};

import { db } from "./firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const seedTasks = async () => {
    const tasks = [
        {
            title: "Grocery Delivery",
            description: "Pick up groceries from FreshMart and deliver to HSR Layout.",
            reward: 150,
            distance: 1.2,
            category: "delivery",
            location: { lat: 12.9121, lng: 77.6446 }, // HSR Layout
            difficulty: "easy",
            createdAt: new Date()
        },
        {
            title: "Mystery Shopper - Starbucks",
            description: "Visit Starbucks Indiranagar, buy a coffee, and rate the service.",
            reward: 350,
            distance: 3.5,
            category: "shopping",
            location: { lat: 12.9784, lng: 77.6408 }, // Indiranagar
            difficulty: "medium",
            createdAt: new Date()
        },
        {
            title: "Document Pickup",
            description: "Pick up legal documents from Koramangala 4th Block.",
            reward: 200,
            distance: 2.1,
            category: "pickup",
            location: { lat: 12.9345, lng: 77.6266 }, // Koramangala
            difficulty: "easy",
            createdAt: new Date()
        },
        {
            title: "Park Survey",
            description: "Visit Cubbon Park and count the number of benches in sector A.",
            reward: 100,
            distance: 0.8,
            category: "survey",
            location: { lat: 12.9757, lng: 77.5929 }, // Cubbon Park
            difficulty: "easy",
            createdAt: new Date()
        },
        {
            title: "Medicine Delivery",
            description: "Deliver medicines to elderly patient in Jayanagar.",
            reward: 250,
            distance: 4.0,
            category: "delivery",
            location: { lat: 12.9250, lng: 77.5938 }, // Jayanagar
            difficulty: "medium",
            createdAt: new Date()
        }
    ];

    try {
        const tasksCollection = collection(db, "tasks");
        for (const task of tasks) {
            await addDoc(tasksCollection, task);
        }
        console.log("Tasks seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding tasks:", error);
        return false;
    }
};

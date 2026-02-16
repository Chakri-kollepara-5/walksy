import { z } from "zod";

export const helpRequestSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(50, "Title must be under 50 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be under 200 characters"),
    category: z.enum(["delivery", "shopping", "pickup", "survey", "other"]),
    urgency: z.enum(["low", "medium", "high"]),
    reward: z.coerce
        .number()
        .min(1, "Minimum reward is ₹1")
        .max(10000, "Maximum reward is ₹10,000"),

    // Locations will be stored as simple objects for now, 
    // later we can upgrade to full GeoPoint/Address objects
    pickupLocation: z.string().min(5, "Pickup location is required"),
    dropLocation: z.string().min(5, "Drop location is required"),

    pickupCoordinates: z.any().optional(),
    dropCoordinates: z.any().optional(),
    location: z.any().optional(),

    // Calculated fields (handled by backend/hook usually, but defining here for validity)
    distance: z.string().optional(),
    duration: z.string().optional(),

    // Metadata
    status: z.enum(["open", "assigned", "in_progress", "completed", "cancelled"]).default("open"),
    createdAt: z.any().optional(), // Firestore Timestamp
    expiresAt: z.any().optional(), // Firestore Timestamp
});



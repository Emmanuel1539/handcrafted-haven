import { z } from "zod";
import { isValidObjectId } from "mongoose";

// Reusable ObjectId validator
export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

// Roles allowed
const roles = ["user", "seller", "admin"] as const;

// User schema
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(roles).optional().default("user"),
});

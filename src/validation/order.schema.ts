import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

const orderItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const orderSchema = z.object({
  userId: objectIdSchema,
  products: z.array(orderItemSchema).nonempty("At least one product is required"),
  total: z.number().min(0, "Total must be 0 or more"),
  status: z
    .string()
    .optional()
    .default("pending")
    .refine(
      (val) =>
        ["pending", "processing", "shipped", "delivered", "cancelled"].includes(val),
      { message: "Invalid order status" }
    ),
});

import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

export const cartItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const cartSchema = z.object({
  userId: objectIdSchema,
  items: z.array(cartItemSchema).nonempty("Cart must have at least one item"),
});

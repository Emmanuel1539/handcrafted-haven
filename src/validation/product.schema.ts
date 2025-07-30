import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Image must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
});

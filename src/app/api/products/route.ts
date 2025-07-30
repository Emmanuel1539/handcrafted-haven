import { connectDB } from "@/utils/connectDB";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";
import { productSchema } from "@/validation/product.schema";

// GET /api/products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(parsed.data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}

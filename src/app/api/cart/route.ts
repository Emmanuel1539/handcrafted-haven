import { connectDB } from "@/utils/connectDB";
import { Cart } from "@/models/cart";
import { NextResponse } from "next/server";
import { cartSchema } from "@/validation/cart.schema";

export async function GET() {
  await connectDB();
  const carts = await Cart.find()
    .populate("userId")
    .populate("items.productId");
  return NextResponse.json(carts);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate with Zod
    const parsed = cartSchema.parse(data);

    await connectDB();
    const newCart = await Cart.create(parsed);
    return NextResponse.json(newCart, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid input", error: err },
      { status: 400 }
    );
  }
}

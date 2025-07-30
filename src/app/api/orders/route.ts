import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import "@/models/user";
import "@/models/product";
import { NextResponse } from "next/server";
import { orderSchema } from "@/validation/order.schema";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate with zod schema
    const validatedData = orderSchema.parse(body);

    const order = await Order.create(validatedData);
    const populatedOrder = await Order.findById(order._id)
      .populate("userId")
      .populate("products.productId");

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", issues: error.errors },
        { status: 400 }
      );
    }

    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

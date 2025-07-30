import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper function to extract params safely
async function getParams(params: Promise<{ id: string }>) {
  return params;
}

// Validate ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/orders/:id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(id)
      .populate("userId")
      .populate("products.productId");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();
    const data = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/:id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}

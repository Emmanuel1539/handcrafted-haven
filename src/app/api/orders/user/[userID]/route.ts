import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";
import { objectIdSchema } from "@/validation/order.schema";

// Helper function to extract params safely
async function getParams(params: Promise<{ userID: string }>) {
  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams); // Log for debugging
  return resolvedParams;
}

// GET /api/orders/user/:userID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    const { userID } = await getParams(params);

    // Log the userID for debugging
    console.log("Received userID:", userID);

    // Validate userID
    if (!userID) {
      console.log("No userID provided in params");
      return NextResponse.json(
        { message: "No user ID provided" },
        { status: 400 }
      );
    }

    // Validate using zod schema
    const parseResult = objectIdSchema.safeParse(userID);
    if (!parseResult.success) {
      console.log("Invalid userID format:", userID, parseResult.error);
      return NextResponse.json(
        { message: "Invalid user ID", issues: parseResult.error },
        { status: 400 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId: userID })
      .populate("userId")
      .populate("products.productId");

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user", userID },
        { status: 404 }
      );
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
import { connectDB } from "@/utils/connectDB";
import { Product } from "@/models/product";
import { productSchema } from "@/validation/product.schema";
import { NextRequest, NextResponse } from "next/server";

async function getParams(params: Promise<{ id: string }>) {
  return params;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context.params);

  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Failed to get product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context.params);

  try {
    await connectDB();
    const data = await req.json();

    // We are Validating with existing Zod schema
    const parsed = productSchema.partial().safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context.params);

  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

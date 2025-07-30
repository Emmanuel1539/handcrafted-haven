import { connectDB } from "@/utils/connectDB";
import { User } from "@/models/user";
import { userSchema } from "@/validation/user.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const role = req.nextUrl.searchParams.get("role");

  const filter: any = {};
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter).select("-password"); // Exclude password
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  // Validate input using Zod
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid user data",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Exclude password in response
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return NextResponse.json(userWithoutPassword, { status: 201 });
}

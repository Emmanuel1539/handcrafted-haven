import { connectDB } from "@/utils/connectDB";
import { User } from "@/models/user";
import { hashPassword } from "@/lib/bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    await connectDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ message: "User created successfully", user }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(
      JSON.stringify({ 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

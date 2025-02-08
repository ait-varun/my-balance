import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDB();
    
    const { name, email, password } = await req.json();

    // Check if user exists
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create user
    const newUser: IUser = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error signing up", error }, { status: 500 });
  }
}

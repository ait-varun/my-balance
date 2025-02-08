import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connectToDB();
    
    const { email, password } = await req.json();

    // Find user
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate token
    const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ message: "Login successful", token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error logging in", error: error }, { status: 500 });
  }
}

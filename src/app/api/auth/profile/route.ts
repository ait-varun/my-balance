import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import { authenticate } from "@/middleware/auth";

export async function GET(req: NextRequest) {  // <-- Fix: Use NextRequest
  try {
    await connectToDB();

    const userId = await authenticate(req); 
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: IUser | null = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching profile", error: error.message }, { status: 500 });
  }
}

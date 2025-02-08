
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectToDB();

  const { email, password } = req.body;

  // Find user
  const user: IUser | null = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Compare password
  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate token
  const token: string = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({ message: "Login successful", token, user });
}

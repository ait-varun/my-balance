import { NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import { authenticate, AuthenticatedRequest } from "@/middleware/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectToDB();
  
  const user: IUser | null = await User.findById(req.user?.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
}

export default authenticate(handler);

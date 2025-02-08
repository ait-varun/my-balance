import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends NextApiRequest {
  user?: { userId: string };
}

export const authenticate = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token", error });
    }
  };
};

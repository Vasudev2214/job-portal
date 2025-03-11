import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma";


// Middleware to protect routes

// ✅ Extend Request Type to Include User
interface AuthRequest extends Request {
  user?: { id: number; name: string; email: string;role:string};
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔹 Token Received:", token);

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("🔹 Decoded Token:", decoded);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true,role:true },
      });

      req.user = user || undefined;

      console.log("🔹 Authenticated User:", req.user);

      if (!req.user) {
        console.log("🔴 User Not Found");
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next();
    } catch (error) {
      console.log("🔴 Authentication Error:", (error as Error).message);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    console.log("🔴 No Token Provided");
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

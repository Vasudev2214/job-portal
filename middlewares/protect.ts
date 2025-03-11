import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
  
        console.log("🔹 Token Received:", token); // Debugging
  
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("🔹 Decoded Token:", decoded); // Debugging
  
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true },
        });
        req.user = user || undefined;
  
        console.log("🔹 Authenticated User:", req.user); // Debugging
  
        if (!req.user) {
          console.log("🔴 ERROR: User Not Found in DB!");
          return res.status(401).json({ success: false, message: "Not authorized" });
        }
  
        next();
      } catch (error) {
        if (error instanceof Error) {
          console.log("🔴 JWT ERROR:", error.message); // Debugging
        } else {
          console.log("🔴 JWT ERROR:", error); // Debugging
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
    } else {
      console.log("🔴 ERROR: No Token Provided!");
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
  };
  



declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }
}
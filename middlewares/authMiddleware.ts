import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";


// Ensure JWT secret exists
const JWT_SECRET: string = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

// Extend Express Request Interface
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; name: string; email: string; role: string };
  }
}

// ✅ Middleware: Verify JWT and Extract User
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("🔹 Received Auth Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; name: string; email: string; role: string };
    console.log("✅ Decoded Token:", decoded); // Debugging

    // Validate user exists in DB
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: "Invalid token: User no longer exists." });
    }

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ Middleware: Check User Role
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ success: false, message: "Access Denied: Not authenticated." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access Denied: Requires one of these roles: ${roles.join(", ")}` 
      });
    }

    next();
  };
};

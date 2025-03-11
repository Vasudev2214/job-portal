import { authenticateUser } from './../middlewares/authMiddleware';
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import uploadMiddleware from "../middlewares/uploadMiddleware";
import { v2 as cloudinary } from "cloudinary";



// Generate JWT Token
const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @Desc Register a new user
// @Route POST /api/auth/register
// @Access Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("Received request body:", req.body); // Debug incoming data

    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    console.log("User exists check:", userExists);

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    console.log("User created:", user);

    res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    });
  } catch (error: any) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// @Desc Login user & get token
// @Route POST /api/auth/login
// @Access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true, // Ensure role is included
      }
    });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role }, // ✅ Include all details
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );
    

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error: any) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// @Desc Get user profile
// @Route GET /api/auth/profile
// @Access Private (requires auth middleware)
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized - No user found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        resume: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error in getProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }


  
});


export const uploadResume = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const userId = (req as any).user?.id; // Ensure the user ID is extracted
  const resumeUrl = (req.file as any).path; // Get the Cloudinary URL

  if (!userId) {
     res.status(401).json({ success: false, message: "Unauthorized request" });
  }

  // Debugging logs
  console.log("✅ User ID:", userId);
  console.log("✅ Resume URL:", resumeUrl);

  // Update the resume URL in the database
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { resume: resumeUrl },
  });

  console.log("✅ Updated User in DB:", updatedUser);

   res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    resumeUrl,
  });
});

// Update User Profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const userId = req.user?.id; // Ensure `req.user` is set via middleware

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update profile");
  }
});


//delete resume 
// Delete Resume
// Delete Resume
export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    // Get the user's current resume
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { resume: true },
    });

    if (!user || !user.resume) {
      res.status(404);
      throw new Error("No resume found to delete");
    }

    // Extract Cloudinary public_id from the URL
    const resumeUrlParts = user.resume.split("/");
    const publicId = resumeUrlParts[resumeUrlParts.length - 1].split(".")[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Update user record to remove resume
    await prisma.user.update({
      where: { id: userId },
      data: { resume: null },
    });

    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to delete resume");
  }
});


export const changePassword = async (req: Request, res:Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id; // Get user ID from auth middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare current password with hashed password in DB
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


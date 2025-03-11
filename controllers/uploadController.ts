import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const userId = req.user?.id; // Ensure `req.user` exists (from authentication middleware)
  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  // Upload to Cloudinary
  cloudinary.uploader.upload_stream({ resource_type: "raw" }, async (error, result) => {
    if (error || !result) {
      res.status(500).json({ error: "Upload failed" });
    } else {
      // **Update database with resume URL**
      await prisma.user.update({
        where: { id: userId },
        data: { resume: result.secure_url },
      });

      res.json({
        success: true,
        message: "Resume uploaded successfully",
        resumeUrl: result.secure_url,
      });
    }
  }).end(req.file.buffer);
});

// Middleware for Multer file upload
export const uploadMiddleware = upload.single("resume");

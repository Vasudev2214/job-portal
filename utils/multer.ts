import multer from "multer";
import { Request } from "express";

// ✅ Define Storage (use memory storage for Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs and images are allowed!"), false);
  }
};

// ✅ Initialize Multer Middleware
const uploadMiddleware = multer({ storage, fileFilter });

export default uploadMiddleware;

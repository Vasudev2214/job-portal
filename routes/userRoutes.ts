import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { uploadResume } from './../controllers/uploadController';
import express from "express";
import { registerUser, loginUser, getProfile,updateProfile,deleteResume,changePassword } from "../controllers/userController";
import { protect } from "../middlewares/auth";

// ✅ Import Fixed Multer Middleware
import uploadMiddleware from "../utils/multer"; // ✅ Import Fixed Multer Middleware
import { authenticateUser } from "../middlewares/authMiddleware";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile); // 🔒 Protected route
// ✅ Use `uploadMiddleware.single("resume")` for single file uploads
router.post("/upload-resume", authenticateUser, uploadMiddleware.single("resume"), uploadResume);
router.put("/update-profile", protect, updateProfile);
router.delete("/delete-resume", protect, deleteResume);

router.put("/change-password", authenticateUser, changePassword);


export default router;

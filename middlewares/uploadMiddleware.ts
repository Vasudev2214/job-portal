import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Set up Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: "resumes", // ✅ Ensure folder is inside params function
      format: "pdf", // or file.originalname.split('.').pop() to keep original format
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// ✅ Initialize Multer with Storage
const uploadMiddle = multer({ storage });

export default uploadMiddle;

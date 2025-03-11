import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  applyForJob,
  getMyApplications,
} from "../controllers/jobController";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

// ✅ Protect job creation (Optional: Allow only Admins)
router.post("/", authenticateUser, authorizeRoles(["admin"]), createJob);

// ✅ Public Routes
router.get("/", getJobs);
router.get("/my-applications", authenticateUser, getMyApplications);
router.get("/:id", getJobById);

// ✅ Protected Routes
router.post("/apply", authenticateUser, applyForJob);


export default router;

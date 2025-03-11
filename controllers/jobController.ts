import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma";

interface AuthenticatedRequest extends Request {
  user?: { id: number; name: string; email: string;role:string; resume?: string };
}

// ✅ Create a Job Posting
export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, company, location, salary } = req.body;

  if (!title || !description || !company || !location) {
    res.status(400).json({ success: false, message: "Please provide all required job details" });
    return;
  }

  const salaryValue = salary ? parseFloat(salary) : null; // Convert to float or set null

const job = await prisma.job.create({
  data: {
    title,
    description,
    company,
    location,
    salary: salaryValue, // Ensure it's a number
  },
});

  res.status(201).json({ success: true, message: "Job created successfully", job });
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await prisma.job.findMany({ include: { applications: true } });
  res.json(jobs);
});


export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const jobId = Number(req.params.id);

  if (!jobId || isNaN(jobId)) {
    res.status(400).json({ success: false, message: "Invalid Job ID format" });
    return;
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return;
  }

  res.json(job);
});

// ✅ Apply for a Job
export const applyForJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized - No user found in request." });
    return;
  }

  const jobId = Number(req.body.jobId);
  const userId = req.user.id;

  if (!jobId || isNaN(jobId)) {
    res.status(400).json({ success: false, message: "Invalid Job ID format" });
    return;
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return;
  }

  const existingApplication = await prisma.application.findFirst({
    where: { jobId, userId },
  });

  if (existingApplication) {
    res.status(400).json({ success: false, message: "You have already applied for this job" });
    return;
  }

  const application = await prisma.application.create({
    data: { jobId, userId },
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

export const getMyApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized - No user found in request." });
    return;
  }
  console.log("🔹 User ID from request:", req.user.id); // ✅ Debugging
  

  
  const applications = await prisma.application.findMany({
    where: { userId: req.user.id },
    include: { job: { select: { id: true, title: true, company: true } } },
  });
  console.log("✅ Applications found:", applications); // ✅ Debugging

  if (!applications.length) {
    res.status(404).json({ success: false, message: "No job applications found" });
    return;
  }

  res.json({ success: true, applications });
});

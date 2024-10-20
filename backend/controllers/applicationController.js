import cloudinary from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import dotenv from "dotenv";

dotenv.config();
// Log to verify if environment variables are loaded correctly
console.log("Cloudyash Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("APIyashyash Key:", process.env.CLOUDINARY_API_KEY);
console.log("APIyash Secret:", process.env.CLOUDINARY_API_SECRET);
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Logging user information and role
  console.log("Request User:", req.user);
  console.log("User Role:", role);

  if (role === "Employer") {
    console.log("Employer attempting to access restricted resource.");
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  // Check for files in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No files found in the request.");
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  console.log("Uploaded Resume File:", resume);

  // Validate file type
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  if (!allowedFormats.includes(resume.mimetype)) {
    console.log("Invalid resume format:", resume.mimetype);
    return next(new ErrorHandler("Invalid file type. Please upload a valid format file.", 400));
  }

  // Uploading file to Cloudinary
  try {
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath, {
      resource_type: 'auto', // Automatically detect the resource type (image/video)
    });

    console.log("Cloudinary Response:", cloudinaryResponse);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    }

    // Extract request body fields
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    console.log("Request Body:", { name, email, coverLetter, phone, address, jobId });

    // Validate job ID
    if (!jobId) {
      console.log("Job ID not provided.");
      return next(new ErrorHandler("Job not found!", 404));
    }

    // Fetch job details
    const jobDetails = await Job.findById(jobId);
    console.log("Job Details:", jobDetails);
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    const applicantID = {
      user: req.user._id,
      role: "Job Seeker",
    };

    const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
    };

    // Validate required fields
    if (!name || !email || !coverLetter || !phone || !address || !resume) {
      console.log("Missing required fields.");
      return next(new ErrorHandler("Please fill all fields.", 400));
    }

    // Creating application
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    console.log("Application Created Successfully:", application);

    // Sending response
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("Error in postApplication:", error);
    return next(new ErrorHandler("An unexpected error occurred!", 500));
  }
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);

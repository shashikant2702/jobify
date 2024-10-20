import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import applicationRouter from "./routes/applicationRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Initialize app and load environment variables
const app = express();
config({ path: "./config/config.env" });

// Set up CORS with proper origin matching and credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use FRONTEND_URL from .env or default to local frontend
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,  // Allow credentials (cookies, headers) across domains
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers in CORS
  })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Route handlers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Connect to the database
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

// Default error handling if no route matches
app.use((req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;

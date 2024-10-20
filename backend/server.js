import cloudinary from "cloudinary";
import app from "./app.js"; // Assuming your main app logic is in app.js
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const PORT = process.env.PORT || 5000; // Default to port 5000

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Corrected from CLIENT_NAME
  api_key: process.env.CLOUDINARY_API_KEY,      // Corrected from CLIENT_API
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Corrected from CLIENT_SECRET
});

// Log to verify if environment variables are loaded correctly
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

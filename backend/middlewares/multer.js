 // Import the multer library for handling file uploads
import multer from "multer";

// Initialize multer with memory storage configuration
const upload = multer({
  // Store the uploaded files in memory as Buffers, rather than saving them to disk
  storage: multer.memoryStorage(),
});

// Export the configured upload middleware for use in other files/routes
export default upload;

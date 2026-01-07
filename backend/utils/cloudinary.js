// Import the 'v1' version of the Cloudinary SDK and alias it as 'cloudinary'.
import {v2 as cloudinary} from "cloudinary";

// Import the 'dotenv' library, which is used to load environment variables from a .env file.
import dotenv from "dotenv";

// Configure and load environment variables from the default .env file into process.env.
dotenv.config({});

// Configure the Cloudinary SDK using credentials stored in environment variables
// to keep sensitive information secure and separate from the source code.
cloudinary.config({
  // Your Cloudinary cloud name.
  cloud_name: process.env.CLOUD_NAME,
  // Your Cloudinary API key.
  api_key: process.env.API_KEY,
  // Your Cloudinary API secret.
  api_secret: process.env.API_SECRET
});

// Export the configured Cloudinary object so it can be imported and used
// in other parts of your application to interact with the Cloudinary service.
export default cloudinary;
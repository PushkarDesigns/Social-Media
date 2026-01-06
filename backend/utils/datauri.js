// Import the necessary libraries for parsing data URIs and handling file paths.
import DataUriParser from "datauri/parser.js";
import path from "path";

// Instantiate a new DataUriParser. This object will be used to format the data.
const parser = new DataUriParser();

// /**
//  * Converts a given file object (containing originalname and buffer) into a data URI string.
//  *
//  * @param {object} file - The file object, typically from a file upload middleware (e.g., multer).
//  * @param {string} file.originalname - The original name of the file (used to determine extension/MIME type).
//  * @param {Buffer} file.buffer - The binary data buffer of the file.
//  * @returns {string} The formatted data URI string (e.g., "data:image/jpeg;base64,...").
//  */
const getDatauri = (file) => {
  // Extract the file extension from the original file name.
  const extName = path.extname(file.originalname).toString();
  
  // Use the parser to format the extension and buffer into a complete data URI string.
  return parser.format(extName, file.buffer).content;
};

// Export the function for use in other modules.
export default getDatauri;

// feat: Add utility function to generate data URI from file buffer

// This commit introduces a new utility function `getDataUri` in `utils/getDataUri.js`.
// It utilizes the `datauri/parser.js` and `path` modules to take a file object (specifically its original name and buffer) and convert it into a base64-encoded data URI string. 

// This function is necessary to allow for the embedding of file data directly within application responses, which is particularly useful for handling image uploads without needing immediate file storage.

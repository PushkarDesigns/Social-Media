import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Define and export a constant arrow function named 'readFileAsDataURL' that accepts a 'file' object.
export const readFileAsDataURL = (file) => {
  // Return a new Promise (an object representing a future action) that takes a 'resolve' function.
  // Note: 'PromiseRejectionEvent' in the image is a typo; it should be 'Promise'.
  return new Promise((resolve) => {
    // Create a new instance of the built-in FileReader object to read file contents.
    const reader = new FileReader();

    // Set an event handler that runs when the file reading operation is successfully completed.
    reader.onloadend = () => {
      // Check if the result of the file read is a string and, if so, fulfill the Promise with that string data.
      if (typeof reader.result === 'string') resolve(reader.result);
    };

    // Start reading the provided file's data and encode it as a Data URL (a base64 encoded string).
    reader.readAsDataURL(file);
  });
};

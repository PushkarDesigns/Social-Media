// Import the Conversation and Message models from the specified paths.
// These models represent collections in the MongoDB database.
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Define an asynchronous function 'sendMessage' that handles the API request and response.
// 'req' is the request object, and 'res' is the response object.
export const sendMessage = async (req, res) => {
  try {
    // Extract the sender's ID from the request object (likely added by authentication middleware)
    const senderId = req.id;
    // Extract the receiver's ID from the URL parameters (e.g., /send/:id)
    const receiverId = req.params.id;
    // Extract the message content from the request body (e.g., JSON data)
    const { message } = req.body;

    // Try to find an existing conversation document that includes both the sender and receiver IDs
    // The $all operator ensures both IDs are present in the 'participants' array
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // If no existing conversation is found (it returns null)
    if (!conversation) {
      // Create a new conversation document in the database
      conversation = await Conversation.create({
        participants: [senderId, receiverId] // Initialize the participants array
      });
    }

    // Create a new message document instance
    const newMessage = await Message.create({
      senderId, // Set the sender ID
      receiverId, // Set the receiver ID
      message // Set the message content
    });

    // If the message was successfully created in the database
    if (newMessage) {
      // Push the ID of the new message into the conversation's messages array
      conversation.messages.push(newMessage._id);
    }

    // Simultaneously save both the updated conversation and the new message document
    await Promise.all([conversation.save(), newMessage.save()]);

    // Implement socket IO for real time data transfer (This is a comment in the original code)

    // Return a successful response (HTTP 201 Created) with status and the new message data
    return res.status(201).json({
      success: true, // Indicate the operation was successful
      newMessage // Include the newly created message object in the response
    });
  } catch (error) {
    // If any error occurs in the try block, catch it here
    console.log(error); // Log the error for debugging purposes
    // An actual API would likely send an error response back to the client here
    // res.status(500).json({ message: "Internal server error" });
  }
};

// Function assumes 'Conversation' and likely 'Message' models are imported from other files.
// It uses 'req.id' (senderId), which is likely added by a prior authentication middleware.
export const getMessage = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request object
    const senderId = req.id;
    // Get the other user's ID from the request parameters (e.g., from a URL like '/messages/:id')
    const receiverId = req.params.id;

    // Find the single conversation document where the 'participants' array contains BOTH IDs ($all operator)
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // If no conversation is found (it returns null)
    if (!conversation) {
      // Return a success status 200 OK, but with an empty messages array
      return res.status(200).json({ success: true, messages: [] });
    }

    // If a conversation IS found:
    // Return a success status 200 OK with the array of messages associated with that conversation
    return res.status(200).json({ success: true, messages: conversation.messages });

  } catch (error) {
    // If any part of the try block fails (e.g., database connection error), catch the error here
    console.log(error); // Log the error to the server console for debugging
    // A robust API would usually send a 500 status response here as well
  }
};

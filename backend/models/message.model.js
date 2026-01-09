import mongoose from "mongoose";

// message model
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: true,
    },
    messages: {
        type: String,
        require: true,
    },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
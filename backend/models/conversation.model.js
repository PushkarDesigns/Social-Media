import mongoose from "mongoose";

// conversation model
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        require: true,
    }],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation
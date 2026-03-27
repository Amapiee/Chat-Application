import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderID: {
            required: true,
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },

        receiverID: {
            required: true,
            ref: "User",
            // ID of the conversation this message belongs to
            type: mongoose.Schema.Types.ObjectId,
        },

        text: {
            type: String,
        },

        image: {
            // URL of the image
            type: String,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        }
    }
)

const Message = mongoose.model("Message", messageSchema);
export default Message;
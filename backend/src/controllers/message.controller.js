import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserID = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: currentUserID } }).select("-password -email -createdAt -updatedAt");
        res.status(200).json(filteredUsers);
    }

    catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async(req, res) => {
    try {
        const { _id: myID} = req.user._id;
        const { userToChatID } = req.params;

        const messages = await Message.find({
            $or: [
                { senderID: myID, receiverID: userToChatID },
                { senderID: userToChatID, receiverID: myID }
            ]   
        });
        res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessages = async(req, res) => {
    try {
        const { text, image} = req.body;
        const { _id: senderID} = req.user._id;
        const { id: receiverID} = req.params;
        let imageURL;

        if(image){
            const uploadedImage = await cloudinary.uploader.upload(image)
            imageURL = uploadedImage.secure_url;
        }
        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL,
        });
        await newMessage.save();
        res.status(200).json({ message: "Message sent successfully", newMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

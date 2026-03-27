import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // 1. Tạo token
            generateToken(newUser._id, res);
            // 2. Lưu vào DB
            await newUser.save();

            // 3. CHỈ PHẢN HỒI MỘT LẦN DUY NHẤT VÀ KẾT THÚC HÀM BẰNG RETURN
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({ message: "Signout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        //Logic upload ảnh lên Cloudinary và lưu URL vào DB
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        return res.status(200).json({message: "Profile picture updated successfully", profilePic: updatedUser.profilePic});
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json({ message: "Authenticated", user: req.user});
    }
    catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

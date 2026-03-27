import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // IF token is valid, decoded will contain the payload we set when signing the token (in this case, userId)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Find the user by ID from the token payload, and exclude the password field
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        // Categorize JWT errors to return appropriate status codes and messages
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
}
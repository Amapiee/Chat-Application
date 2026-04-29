import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

// 1. Cấu hình DNS để ưu tiên IPv4, giúp tránh lỗi querySrv DNS khi kết nối MongoDB Atlas
// 2. Cấu hình biến môi trường
// 3. Middleware để xử lý JSON
// 4. Định nghĩa routes
// 5. Kết nối Database trước khi khởi động server

import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server} from "./lib/socket.js";
import path from "path";

// 1. Ép ưu tiên IPv4 để xử lý lỗi querySrv DNS
dns.setDefaultResultOrder('ipv4first');

// 2. Cấu hình biến môi trường
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// 3. MIDDLEWARE xử lý JSON
app.use(express.json({limit: '10mb'})); // Để đọc được dữ liệu JSON từ Postman
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 4. ROUTES
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,              // Cho phép gửi cookie qua CORS
}))
app.use(cookieParser()); // Để đọc được cookie từ request
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("(.*)", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    });
}

// 5. KHỞI ĐỘNG SERVER 
const startServer = async () => {
    try {
        await connectDB();
        
        server.listen(PORT, () => {
            console.log("Server is running on port: " + PORT);
        });
    } catch (error) {
        console.error("Error starting server:");
        console.error(error.message);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
};

startServer();
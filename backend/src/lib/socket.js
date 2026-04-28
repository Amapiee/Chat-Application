import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:
    {
        origin: ["http://localhost:5173"],
    },
});

// userId as key and socketId as value
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    const userId = socket.handshake.query.userId;
    userSocketMap[userId] = socket.id;
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
        delete userSocketMap[userId];
        socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export { io, app, server };
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const msgRoutes = require("./routes/msgsRoutes")
const socket = require('socket.io')
const axios = require('axios')

const app = express();
require("dotenv").config();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port${process.env.PORT}`);
})

app.use(cors());
app.use(express.json());

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

app.use("/api/auth", userRoutes)
app.use("/api/messages", msgRoutes)

connectToMongo();

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    
    socket.on("send-msg", async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved", {msg: data.message, time: data.timeStamp, to: data.to, from: data.from, uuid: new Date()});
            await axios.post('http://localhost:5000/api/auth/updateNotification', {
                uid: data.to,
                from: data.from,
                lastMessage: data.message,
                time: data.timeStamp,
                notification: 1
            })
        }
    });

    socket.on("get-online-users", () => {
        const data = onlineUsers
        socket.emit("online-users", data)
    })
})

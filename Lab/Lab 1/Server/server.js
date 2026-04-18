const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const chatStore = {
    rooms: {
        global: []
    }
};

const MAX_MESSAGES = 100;
const users = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", ({ username, room = "global" }) => {
        users[socket.id] = { username, room };

        socket.join(room);

        const history = chatStore.rooms[room] || [];
        socket.emit("chat_history", history);

        socket.to(room).emit("user_joined", { username });
    });

    socket.on("send_message", (msg) => {
        const user = users[socket.id];
        if (!user) return;

        const { room } = user;

        if (!chatStore.rooms[room]) {
            chatStore.rooms[room] = [];
        }

        chatStore.rooms[room].push(msg);

        if (chatStore.rooms[room].length > MAX_MESSAGES) {
            chatStore.rooms[room].shift();
        }

        io.to(room).emit("receive_message", msg);
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        delete users[socket.id];

        if (user) {
            socket.to(user.room).emit("user_left", {
                username: user.username
            });
        }
    });
});

server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
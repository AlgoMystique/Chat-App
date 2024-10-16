const express = require("express");
const app = express ();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors()); 

app.use(express.static("client_build")); 
//generate the server by passing express app through function
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

//we are listening for events in our socket io server

io.on("connection", (socket) => {
 console.log(`User Connected: ${socket.id}`);

 socket.on("join_room", (data)=> {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
 });

 socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
 });

 socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
 });
});

//listen to port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT}`);
});
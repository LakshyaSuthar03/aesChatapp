import express from "express";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto-js";
import "./db/connection.js";
import chatModel from "./db/models/chatModel.js";
import cors from "cors";
import bodyParser from "body-parser";
let password = null;
const app = express();
const httpServer = http.createServer(app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    //this is an ES6 Set of all client ids in the room
    const clients = io.sockets.adapter.rooms.get(data.room);
    //to get the number of clients in this room
    const numClients = clients ? clients.size : 0;
    console.log(password);
    if (numClients == 0 && !password) {
      socket.join(data.room);
      password = data.password;
      socket.emit("join-room-response", { status: "success" });
      return;
    } else {
      if (password == data.password) {
        socket.join(data.room);
        socket.emit("join-room-response", { status: "success" });
        return;
      }
    }
    socket.emit("join-room-response", { status: "failed" });
  });

  socket.on("send-msg", async (data) => {
    const encryptedData = crypto.AES.encrypt(
      JSON.stringify(data).toString(),
      "secret passphrase"
    ).toString();
    await chatModel
      .create({
        room: data.room,
        data: { encryptedData },
      })
      .then((result) => {
        socket.to(data.room).emit("broadcasted-msg", encryptedData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.post("/chats", async (req, res) => {
  const room = req.body.room;
  const chats = await chatModel.find({ room: room });
  res.json(chats);
});
httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});

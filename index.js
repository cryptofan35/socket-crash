const express = require("express")();
const https = require("http");
require("dotenv").config();

const port = process.env.SOCKET_PORT;

const socketIo = require("socket.io");
const httpServer = https.createServer(express);
const ToolForEvent = require("./socket.js")();

const io = socketIo(httpServer, {
  path: "/websocket",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

async function main() {
  ToolForEvent.init(io, express);
  httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();

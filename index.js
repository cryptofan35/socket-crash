const express = require("express")();
const https = require("http");
require("dotenv").config();
const db = require("./models");

const port = process.env.SOCKET_PORT;

const socketIo = require("socket.io");
const httpServer = https.createServer(express);
const ToolForEvent = require("./socket.js")();

// Connect to Mysql
db.sequelize
  .sync()
  .then(() => {
    console.log("Mysql is connected.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


const io = socketIo(httpServer, {
  path: "/",
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

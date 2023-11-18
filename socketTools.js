"use strict";
module.exports = socketTools;

let io;
let crashUpdateData;
// Function to generate crash update data with a rapidly changing plane movement
function generateCrashUpdate() {
  // Function to generate random number
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Function call
  const currentPlanePosition = randomNumber(1, 10).toFixed(2); // Generate a positive value between 0 and 4

  return {
    event: "crash-update",
    data: {
      position: currentPlanePosition.toFixed(2),
    },
  };
}

let interval;

function socketTools() {
  return { init, getData };

  function init(_io, express) {
    io = _io;
    io.on("connection", onConnet);
  }
  function onConnet(socket) {
    clearInterval(interval);
    console.log(`User connected: ${socket.id}`);

    socket.emit("working", "1");
    socket.emit("prepareplane", "6");
    socket.emit("flyplane", "7");

    // Emit the 'crash-update' event with generated data when a user connects
    crashUpdateData = generateCrashUpdate();
    socket.emit(crashUpdateData.event, 0);

    let number = 0;
    let intervalTime = 300;
    let totalAmount = 0;
    let cashOutAmount = 0;
    socket.on("addWin", (name, amount, winpoint) => {
      cashOutAmount += amount + amount * winpoint;
      console.log(
        name,
        amount,
        winpoint,
        cashOutAmount,
        "here is cashOut amount"
      );
    });

    socket.on("newBet", (name, amount) => {
      totalAmount += amount;
      console.log(name, amount, totalAmount, "here is total amount");
    });

    const intervalCrash = () => {
      // if (number < crashUpdateData.data.position) {
      if (number < 0.2) {
        console.log(
          "-------------->",
          number.toFixed(2),
          crashUpdateData.data.position
        );
        number += 0.01;
        socket.emit(crashUpdateData.event, number.toFixed(2));
      } else {
        console.log("crash plane");

        socket.emit("updatehistory", number);
        socket.emit("reset", number);
        socket.emit("removecrash", number);
        number = 0;

        clearInterval(interval);
        crashUpdateData = generateCrashUpdate();

        setTimeout(() => {
          socket.emit("prepareplane", "6");
          socket.emit("working", "1");
          socket.emit("flyplane", "7");
          interval = setInterval(intervalCrash, intervalTime);
        }, 5000);
      }
    }; // Update the interval based on your requirement

    interval = setInterval(intervalCrash, intervalTime);
  }

  // Emit the 'crash-update' event with generated data when a user connects

  async function getData() {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}

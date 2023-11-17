"use strict";
module.exports = socketTools;

let io;
let crashUpdateData;
// Function to generate crash update data with a rapidly changing plane movement
function generateCrashUpdate() {
  const currentPlanePosition = Math.abs(Math.random()) * 4; // Generate a positive value between 0 and 4

  return {
    event: "crash-update",
    data: {
      position: currentPlanePosition.toFixed(2),
      // Other relevant data for the crash update
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

    io.emit("working", "1");
    io.emit("prepareplane", "6");
    io.emit("flyplane", "7");

    // Emit the 'crash-update' event with generated data when a user connects
    crashUpdateData = generateCrashUpdate();
    io.emit(crashUpdateData.event, 0);

    let number = 0;
    let intervalTime = 500;
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
      if (number < 0.2) {
        console.log(
          "-------------->",
          number.toFixed(2),
          crashUpdateData.data.position
        );
        number += 0.01;
        io.emit(crashUpdateData.event, number.toFixed(2));
      } else {
        console.log("crash plane");

        io.emit("updatehistory", number);
        io.emit("reset", number);
        io.emit("removecrash", number);
        number = 0;

        clearInterval(interval);
        crashUpdateData = generateCrashUpdate();

        setTimeout(() => {
          io.emit("prepareplane", "6");
          io.emit("working", "1");
          io.emit("flyplane", "7");
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

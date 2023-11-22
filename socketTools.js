"use strict";
module.exports = socketTools;
const db = require("./models");
const Record = db.crashbetrecord;
const Aviset = db.aviset
let io;
let crashUpdateData;
// Function to generate crash update data with a rapidly changing plane movement
function generateCrashUpdate() {
  // Function to generate random number
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Function call
  const currentPlanePosition = randomNumber(1, 10); // Generate a positive value between 0 and 4

  return {
    event: "crash-update",
    data: {
      position: currentPlanePosition,
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

    socket.emit("prepareplane", "6");
    socket.emit("flyplane", "7");

    // Emit the 'crash-update' event with generated data when a user connects
    crashUpdateData = generateCrashUpdate();
    socket.emit(crashUpdateData.event, 0);
    

    let number = 1;
    let betters = 0;
    let intervalTime = 100;
    let totalAmount = 0;
    let cashOutAmount = 0;
    let crashPoint = crashUpdateData.data.position

    socket.on("addWin", async (name, amount, winpoint) => {
      cashOutAmount += amount + amount * winpoint;

      const newRecord = {
        username: name,
        amount: amount,
        status: 'success',
        winpoint: winpoint
      }
      console.log(newRecord)
      await Record.create(newRecord)

      const limitAmount = totalAmount * 0.3
      
      if(cashOutAmount > limitAmount){
        number = crashPoint
        console.log('hahahahaha', number)
      }
      
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
      betters += 1;
      console.log(name, amount, totalAmount, "here is total amount");
    });

    socket.on("failed", async (name, amount, winpoint)=>{
      const newRecord = {
        username: name,
        amount: amount,
        status: 'fail',
        winpoint: winpoint
      }
      console.log(newRecord)
      await Record.create(newRecord)
    })

    const intervalCrash = async () => {
      if (number < crashPoint) {
        console.log(
          "-------------->",
          number,
          crashPoint
        );
        if(betters == 1){
          crashPoint=1.1
        }
        number += 0.01;
        socket.emit(crashUpdateData.event, number.toFixed(2));
        const aviset = await Aviset.findAll()
        if(aviset[0].dataValues.nxt != 0){
          crashPoint = aviset[0].dataValues.nxt
        }

      } else {
        console.log("crash plane");
        await Aviset.update({nxt: 0, id: 1}, {
          where: { id: 1 },
        });
        socket.emit("updatehistory", number.toFixed(2));
        
        socket.emit("reset", "resetting plane...");
        socket.emit("removecrash");
        number = 1;
        crashUpdateData = generateCrashUpdate();
        console.log({crashUpdateData})
        crashPoint = crashUpdateData.data.position
        cashOutAmount = 0;
        totalAmount = 0;
        betters = 0;

        clearInterval(interval);
        setTimeout(() => {
          socket.emit("prepareplane");
          socket.emit("flyplane");
          interval = setInterval(intervalCrash, intervalTime);
        }, 5000);
      }
    }; 

    interval = setInterval(intervalCrash, intervalTime);
  }

  async function getData() {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}

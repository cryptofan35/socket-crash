"use strict";
module.exports = ToolForAsian;

const socketTool = require("./socketTools")();

function ToolForAsian() {
  return { init };

  async function init(_io, express) {
    socketTool.init(_io, express);

    // setInterval(() => {
    //   fetchData();
    // }, 1000);
  }
  // async function fetchData() {
  //   try {
  //     socketTool.getData();
  //   } catch (error) {
  //     console.error("Error fetching odds:", error);
  //   }
  // }
}

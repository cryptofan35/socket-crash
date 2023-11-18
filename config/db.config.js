module.exports = {
  HOST: "148.251.91.91",
  // HOST: "127.0.0.1",
  USER: "dodogame_game",
  // USER: "root",
  PASSWORD: "dodogame_game",
  // PASSWORD: "",
  DB: "dodogame_game",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

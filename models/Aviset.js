module.exports = (sequelize, Sequelize) => {
    const Aviset = sequelize.define(
      "aviset",
      {
        nxt: {
          type: Sequelize.INTEGER,
        }
      }
    );
  
    return Aviset;
  };
  
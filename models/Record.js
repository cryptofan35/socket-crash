module.exports = (sequelize, Sequelize) => {
    const Record = sequelize.define(
      "crashbetrecord",
      {
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status:{
          type: Sequelize.STRING,
          allowNull: false,
        },
        winpoint:{
          type: Sequelize.STRING,
          allowNull: false,
        },
        time: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        timestamps: false,
      }
    );
  
    return Record;
  };
  
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const JockeyModel = sequelize.define(
    "JockeyModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Age: {
        type: DataTypes.INTEGER,
      },
      Rating: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return JockeyModel;
};

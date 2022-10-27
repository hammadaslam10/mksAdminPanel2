const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TrainerModel = sequelize.define(
    "TrainerModel",

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
      Detail: {
        type: DataTypes.STRING,
      },
      Age: {
        type: DataTypes.INTEGER,
      },
      Rating: {
        type: DataTypes.INTEGER,
      },
      Remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return TrainerModel;
};

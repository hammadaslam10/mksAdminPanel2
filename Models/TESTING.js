const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const test = sequelize.define(
    "test",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      HorseModelId1: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      SubscriberModelId1: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return test;
};

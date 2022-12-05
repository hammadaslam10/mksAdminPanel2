const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndHorsesModel = sequelize.define(
    "SubscriberAndHorsesModel",

    {},
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return SubscriberAndHorsesModel;
};

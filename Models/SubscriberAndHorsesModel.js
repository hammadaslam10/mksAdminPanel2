const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndHorsesModel = sequelize.define(
    "SubscriberAndHorsesModel",

    {},
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SubscriberAndHorsesModel;
};

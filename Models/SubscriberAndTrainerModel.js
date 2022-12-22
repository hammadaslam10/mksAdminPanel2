const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndTrainerModel = sequelize.define(
    "SubscriberAndTrainerModel",

    {},
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return SubscriberAndTrainerModel;
};

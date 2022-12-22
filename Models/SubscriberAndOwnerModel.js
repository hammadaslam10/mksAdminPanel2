const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndOwnerModel = sequelize.define(
    "SubscriberAndOwnerModel",

    {},
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return SubscriberAndOwnerModel;
};

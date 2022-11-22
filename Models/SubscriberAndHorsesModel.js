const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndHorsesModel = sequelize.define(
    "SubscriberAndHorsesModel",

    {
      VerdictName: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Verdict will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Verdict will have Rank" },
          notEmpty: { msg: "Rank  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SubscriberAndHorsesModel;
};

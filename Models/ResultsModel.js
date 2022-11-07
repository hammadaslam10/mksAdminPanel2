const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ResultsModel = sequelize.define(
    "ResultsModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      PrizeAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have PrizeAmount" },
          notEmpty: { msg: "PrizeAmount  will not be empty" },
        },
      },
      Points: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Points" },
          notEmpty: { msg: "Points  will not be empty" },
        },
      },
      BonusPoints: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
      Distance: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return ResultsModel;
};

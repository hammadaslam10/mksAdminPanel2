const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndVerdictsHorseModel = sequelize.define(
    "RaceAndVerdictsHorseModel",

    {
      VerdictName: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Verdict" },
          notEmpty: {
            msg: "Without Name Verdict Will not be get submit",
          },
        },
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Rank Of Horse" },
          notEmpty: {
            msg: "Without Rank Horse Will not be get submit",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return RaceAndVerdictsHorseModel;
};

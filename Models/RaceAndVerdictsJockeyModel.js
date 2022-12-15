const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndVerdictsJockeyModel = sequelize.define(
    "RaceAndVerdictsJockeyModel",

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
      JockeyID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      VerdictJockeyRaceID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return RaceAndVerdictsJockeyModel;
};

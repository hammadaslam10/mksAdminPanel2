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
            msg: "Without Name Verdict Will not get submitted",
          },
        },
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Rank Of Horse" },
          notEmpty: {
            msg: "Without Rank Horse Will not get submitted",
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
      initialAutoIncrement: 10,
    }
  );
  return RaceAndVerdictsJockeyModel;
};

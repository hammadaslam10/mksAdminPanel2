const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndCourseModel = sequelize.define(
    "RaceAndCourseModel",
    {
      // GateNo: {
      //   type: DataTypes.INTEGER,
      //   allownull
      // },
      // HorseModel_id: {
      //   type: Sequelize.UUID,
      // },
      // JockeyModel_id: {
      //   type: Sequelize.UUID,
      // },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndCourseModel;
};

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitionRacesPointsModel = sequelize.define(
    "CompetitionRacesPointsModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      // Points: {
      //   type: DataTypes.DOUBLE,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: "Please Add Points Of Competition Race" },
      //     notEmpty: {
      //       msg: "Without Points Competition Race Will not get submitted",
      //     },
      //   },
      // },
      // BonusPoints: {
      //   type: DataTypes.DOUBLE,
      //   allowNull: false,
      //   defaultValue: 0.0,
      //   validate: {
      //     notNull: { msg: "Please Add Points Of Competition Race" },
      //     notEmpty: {
      //       msg: "Without Points Competition Race Will not get submitted",
      //     },
      //   },
      // },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BackupId: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
      // Length: {
      //   type: DataTypes.BIGINT,
      //   allowNull: false,
      // },
    },

    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return CompetitionRacesPointsModel;
};

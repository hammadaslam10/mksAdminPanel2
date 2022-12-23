const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndPointsSystemModel = sequelize.define(
    "RaceAndPointsSystemModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Race: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Point: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndPointsSystemModel;
};

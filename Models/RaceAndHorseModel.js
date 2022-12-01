const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndHorseModel = sequelize.define(
    "RaceAndHorseModel",
    {
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false,
        reference: {
          references: {
            model: "EquipmnetModel",
            key: "_id",
          },
        },
      },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndHorseModel;
};

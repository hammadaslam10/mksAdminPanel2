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
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndHorseModel;
};

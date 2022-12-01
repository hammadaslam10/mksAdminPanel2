const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const OwnerSilkColorModel = sequelize.define(
    "OwnerSilkColorModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      OwnerID: {
        type: DataTypes.UUID,
        allownull: false,
      },
      OwnerSilkColor: {
        type: DataTypes.STRING,
        allownull: false,
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
  return OwnerSilkColorModel;
};

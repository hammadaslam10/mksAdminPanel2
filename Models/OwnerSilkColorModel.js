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
        notNull: { msg: "Please Add ID Of OwnerSilk Color" },
        notEmpty: {
          msg: "Without ID OwnerSilk Color Will not get submitted",
        },
      },
      OwnerSilkColor: {
        type: DataTypes.STRING,
        allownull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return OwnerSilkColorModel;
};

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const OwnerCapModel = sequelize.define(
    "OwnerCapModel",

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
        notNull: { msg: "Please Add ID Of Owner Cap Color" },
        notEmpty: {
          msg: "Without ID Owner Cap Color Will not get submitted",
        },
      },
      OwnerCapColor: {
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
  return OwnerCapModel;
};

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const EquipmentModel = sequelize.define(
    "EquipmentModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z][a-z0-9]*[a-z0-9\s]*[a-z\s]*$/i,
          is: {
            msg: "Please enter Equipment Name in English",
          },
          notNull: { msg: "Equipment will have Name" },
          notEmpty: { msg: "Equipment  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Equipment will have ShortCode" },
          notEmpty: { msg: "Equipment  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669\d\s]+$/m,
          is: {
            msg: "Please enter Equipment Name in Arabic",
          },
          notNull: { msg: "Equipment will have ShortCode" },
          notEmpty: { msg: "Equipment  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return EquipmentModel;
};

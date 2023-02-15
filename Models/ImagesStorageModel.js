const Sequelize = require("sequelize");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  const ImagesStorageModel = sequelize.define(
    "ImagesStorageModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image" },
          notEmpty: {
            msg: "Without Image Will not get submitted",
          },
        },
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return ImagesStorageModel;
};

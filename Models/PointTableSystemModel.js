const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const PointTableSystemModel = sequelize.define(
    "PointTableSystemModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have ShortCode" },
          notEmpty: { msg: "ShortCode  will not be empty" },
        },
      },
      Group_Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Group Name" },
          notEmpty: { msg: "Group Name Point will not be empty" },
        },
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Rank" },
          notEmpty: { msg: "Rank  will not be empty" },
        },
      },
      Point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Point" },
          notEmpty: { msg: "Point  will not be empty" },
        },
      },

      Bonus_Point: {
        type: DataTypes.BIGINT,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return PointTableSystemModel;
};

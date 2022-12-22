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
          notEmpty: { msg: "Group Name  will not be empty" },
        },
      },
      First_Place_Point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have First Place Point" },
          notEmpty: { msg: "First Place Point  will not be empty" },
        },
      },
      Second_Place_Point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Second Place Point" },
          notEmpty: { msg: "Second Place Point  will not be empty" },
        },
      },

      Third_Place_Point: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Point Table System will have Third_Place_Point" },
          notEmpty: { msg: "Third_Place_Point  will not be empty" },
        },
      },
      First_Place_Bonus_Point: {
        type: DataTypes.BIGINT,
      },
      Second_Place_Bonus_Point: {
        type: DataTypes.BIGINT,
      },
      Third_Place_Bonus_Point: {
        type: DataTypes.BIGINT,
      },
      FourthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      FifthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      SixthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
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

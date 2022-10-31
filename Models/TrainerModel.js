const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TrainerModel = sequelize.define(
    "TrainerModel",

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
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      Detail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Detail" },
          notEmpty: { msg: "Detail  will not be empty" },
        },
      },
      Age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Remarks: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Remarks" },
          notEmpty: { msg: "Remarks  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return TrainerModel;
};

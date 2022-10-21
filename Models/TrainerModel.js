const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const TrainerModel = Db.define(
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
    },
    Detail: {
      type: DataTypes.STRING,
    },
    Age: {
      type: DataTypes.INTEGER,
      // validate: {
      //   // is: /^[0-9]+$/,
      //   is: {
      //     msg: "Age should be in number",
      //   },
      // },
    },
    Rating: {
      type: DataTypes.INTEGER,
      // validate: {
      //   // is: /^[0-9]+$/,
      //   is: {
      //     msg: "Rating should be in number",
      //   },
      // },
    },
    Remarks: {
      type: DataTypes.STRING,
      // validate: {
      //   // is: /^[0-9]+$/,
      //   is: {
      //     msg: "Rating should be in number",
      //   },
      // },
    },

    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
TrainerModel.sync();

module.exports = TrainerModel;

const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const JockeyModel = Db.define(
  "JockeyModel",

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
    Age: {
      type: DataTypes.INTEGER,
    },
    Rating: {
      type: DataTypes.INTEGER,
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

JockeyModel.sync();

module.exports = JockeyModel;

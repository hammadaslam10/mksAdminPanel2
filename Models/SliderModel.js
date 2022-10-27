const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SliderModel = sequelize.define(
    "SliderModel",

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
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SliderModel;
};

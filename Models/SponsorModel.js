const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SponsorModel = sequelize.define(
    "SponsorModel",

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
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // is: /^[a-z][a-z\d]*$/i,
          // is: {
          //   msg: "Description Must Be In English in this input",
          // },
          notNull: { msg: "Sponsor will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Description Must Be In Arabic",
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Ad will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
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
      Url: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SponsorModel;
};

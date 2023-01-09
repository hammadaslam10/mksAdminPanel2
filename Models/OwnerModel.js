const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const OwnerModel = sequelize.define(
    "OwnerModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Please Add Owner Image Of Owner" },
        //   notEmpty: {
        //     msg: "Without Owner Image Owner Will not get submitted",
        //   },
        // },
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter Name in English is Empty");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name in English Validation Failed");
            }
          },
        },
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image Of Nationality" },
          notEmpty: {
            msg: "Without Image Nationality Will not get submitted",
          },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.NameAr.trim() == "") {
              throw new Error("Please Enter  Name in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.NameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.NameAr
              )
            ) {
            } else {
              throw new Error("Name Arabic Validation Failed");
            }
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.TitleEn.trim() == "") {
              throw new Error("Please Enter Title in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.TitleEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.TitleEn)
            ) {
            } else {
              throw new Error("Title English Validation Failed");
            }
          },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.TitleAr.trim() == "") {
              throw new Error("Please Enter Title in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.TitleAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.TitleAr
              )
            ) {
            } else {
              throw new Error("Title Arabic Validation Failed");
            }
          },
        },
      },
      ShortEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.ShortEn.trim() == "") {
              throw new Error("Please Enter Short Name in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.ShortEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.ShortEn)
            ) {
            } else {
              throw new Error("Short Name English Validation Failed");
            }
          },
        },
      },
      ShortAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.ShortAr.trim() == "") {
              throw new Error("Please Enter Short Name in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.ShortAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.ShortAr
              )
            ) {
            } else {
              throw new Error("Short Name Arabic Validation Failed");
            }
          },
        },
      },
      RegistrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Registration Date Of Advertisment" },
          notEmpty: {
            msg: "Without Registration Date Advertisment Will not get submitted",
          },
        },
      },
      BackupId: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return OwnerModel;
};

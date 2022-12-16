const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const JockeyModel = sequelize.define(
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
        validate: {
          notNull: { msg: "Please Add Image Of Jockey" },
          notEmpty: {
            msg: "Without Image Jockey Will not be get submit",
          },
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Jockey" },
          notEmpty: {
            msg: "Without Date of birth Jockey Will not be get submit",
          },
        },
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter  Name in English is Empty");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name in English Validation Failed");
            }
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        ArabicLanguageVerification() {
          if (this.NameAr.trim() == "") {
            throw new Error("Please Enter  Name in  Arabic ");
          }
          if (
            /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.NameAr) ||
            /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.NameAr)
          ) {
          } else {
            throw new Error("Name Arabic Validation Failed");
          }
        },
      },
      ShortNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.ShortNameEn.trim() == "") {
              throw new Error("Please Enter ShortName in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.ShortNameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.ShortNameEn)
            ) {
            } else {
              throw new Error("ShortName English Validation Failed");
            }
          },
        },
      },
      ShortNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.ShortNameAr.trim() == "") {
              throw new Error("Please Enter  ShortName in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.ShortNameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.ShortNameAr)
            ) {
            } else {
              throw new Error("ShortName Arabic Validation Failed");
            }
          },
        },
      },
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Jockey" },
          notEmpty: {
            msg: "Without Nationality Jockey Will not be get submit",
          },
        },
      },
      JockeyLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RemarksEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.RemarksEn.trim() == "") {
              throw new Error("Please Enter Remarks in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.RemarksEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.RemarksEn)
            ) {
            } else {
              throw new Error("Remarks English Validation Failed");
            }
          },
        },
      },
      RemarksAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.RemarksAr.trim() == "") {
              throw new Error("Please Enter  Remarks in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.RemarksAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.RemarksAr)
            ) {
            } else {
              throw new Error("Remarks Arabic Validation Failed");
            }
          },
        },
      },
      MiniumumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please MiniumumJockeyWeight Of Jockey" },
          notEmpty: {
            msg: "Without MiniumumJockeyWeight Jockey Will not be get submit",
          },
        },
      },
      MaximumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add MaximumJockeyWeight Of Jockey" },
          notEmpty: {
            msg: "Without MaximumJockeyWeight Jockey Will not be get submit",
          },
        },
      },
      JockeyAllowance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add JockeyAllowance Of Jockey" },
          notEmpty: {
            msg: "Without JockeyAllowance Jockey Will not be get submit",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return JockeyModel;
};

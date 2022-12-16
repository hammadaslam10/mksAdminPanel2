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
        validate: {
          notNull: { msg: "Please Add Image Of Trainer" },
          notEmpty: {
            msg: "Without Image Trainer Will not be get submit",
          },
        },
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter Name in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name English Validation Failed");
            }
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
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.NameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.NameAr)
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
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.TitleEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.TitleEn)
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
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.TitleAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.TitleAr)
            ) {
            } else {
              throw new Error("Title Arabic Validation Failed");
            }
          },
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Trainer" },
          notEmpty: {
            msg: "Without Date of birth Trainer Will not be get submit",
          },
        },
      },
      TrainerLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add TrainerLicenseDate Of Trainer" },
          notEmpty: {
            msg: "Without TrainerLicenseDate Trainer Will not be get submit",
          },
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
      DetailEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Detail" },
          notEmpty: { msg: "Detail  will not be empty" },
        },
      },
      DetailAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Detail" },
          notEmpty: { msg: "Detail  will not be empty" },
        },
      },

      RemarksEn: {
        type: DataTypes.STRING,
        allowNull: false,
        EnglishLanguageVerification() {
          if (this.RemarksEn.trim() == "") {
            throw new Error("Please Enter remarks in English ");
          }
          if (
            /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.RemarksEn) ||
            /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.RemarksEn)
          ) {
          } else {
            throw new Error("remarks English Validation Failed");
          }
        },
      },
      RemarksAr: {
        type: DataTypes.STRING,
        allowNull: false,
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
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Trainer" },
          notEmpty: {
            msg: "Without Nationality Trainer Will not be get submit",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return TrainerModel;
};

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TrainerModel = sequelize.define(
    "TrainerModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      image: {
        type: DataTypes.STRING
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Please Add Image Of Trainer" },
        //   notEmpty: {
        //     msg: "Without Image Trainer Will not get submitted",
        //   },
        // },
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
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name English Validation Failed");
            }
          }
        }
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
          }
        }
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
          }
        }
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
          }
        }
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Trainer" },
          notEmpty: {
            msg: "Without Date of birth Trainer Will not get submitted"
          }
        }
      },
      TrainerLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Trainer License Date Of Trainer" },
          notEmpty: {
            msg: "Without Trainer License Date Trainer Will not get submitted"
          }
        }
      },
      ShortNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.ShortNameEn.trim() == "") {
              throw new Error("Please Enter Short Name in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.ShortNameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.ShortNameEn)
            ) {
            } else {
              throw new Error("Short Name English Validation Failed");
            }
          }
        }
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" }
        }
      },
      ShortNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.ShortNameAr.trim() == "") {
              throw new Error("Please Enter  Short Name in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.ShortNameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.ShortNameAr
              )
            ) {
            } else {
              throw new Error("Short Name Arabic Validation Failed");
            }
          }
        }
      },
      DetailEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.DetailEn.trim() == "") {
              throw new Error("Please Enter Detail in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.DetailEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.DetailEn)
            ) {
            } else {
              throw new Error("Detail English Validation Failed");
            }
          }
        }
      },
      DetailAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.DetailAr.trim() == "") {
              throw new Error("Please Enter  Detail in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.DetailAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.DetailAr
              )
            ) {
            } else {
              throw new Error("Detail Arabic Validation Failed");
            }
          }
        }
      },

      RemarksEn: {
        type: DataTypes.STRING,
        allowNull: false,
        EnglishLanguageVerification() {
          if (this.RemarksEn.trim() == "") {
            throw new Error("Please Enter remarks in English ");
          }
          if (
            /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.RemarksEn) ||
            /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.RemarksEn)
          ) {
          } else {
            throw new Error("remarks English Validation Failed");
          }
        }
      },
      RemarksAr: {
        type: DataTypes.STRING,
        allowNull: false,
        ArabicLanguageVerification() {
          if (this.RemarksAr.trim() == "") {
            throw new Error("Please Enter  Remarks in  Arabic ");
          }
          if (
            /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
              this.RemarksAr
            ) ||
            /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
              this.RemarksAr
            )
          ) {
          } else {
            throw new Error("Remarks Arabic Validation Failed");
          }
        }
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Trainer" },
          notEmpty: {
            msg: "Without Nationality Trainer will not  get submitted"
          }
        }
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10
    }
  );
  return TrainerModel;
};

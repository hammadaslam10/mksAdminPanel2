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
            msg: "Without Image Jockey Will not get submitted",
          },
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Jockey" },
          notEmpty: {
            msg: "Without Date of birth Jockey Will not get submitted",
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
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name in English Validation Failed");
            }
          },
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
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.ShortNameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.ShortNameAr
              )
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
        validate: {
          notNull: { msg: "Please Add Rating Of Jockey" },
          notEmpty: {
            msg: "Without Rating Jockey Will not get submitted",
          },
        },
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Jockey" },
          notEmpty: {
            msg: "Without Nationality Jockey Will not get submitted",
          },
        },
      },
      JockeyLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Jockey License Date Of Jockey" },
          notEmpty: {
            msg: "Without Jockey License Date Jockey Will not get submitted",
          },
        },
      },
      RemarksEn: {
        type: DataTypes.STRING,
        // validate: {
        //   EnglishLanguageVerification() {
        //     if (this.RemarksEn.trim() == "") {
        //       throw new Error("Please Enter Remarks in English ");
        //     }
        //     if (
        //       /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.RemarksEn) ||
        //       /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.RemarksEn)
        //     ) {
        //     } else {
        //       throw new Error("Remarks English Validation Failed");
        //     }
        //   },
        // },
      },
      RemarksAr: {
        type: DataTypes.STRING,
        // validate: {
        //   ArabicLanguageVerification() {
        //     if (this.RemarksAr.trim() == "") {
        //       throw new Error("Please Enter  Remarks in  Arabic ");
        //     }
        //     if (
        //       /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
        //         this.RemarksAr
        //       ) ||
        //       /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
        //         this.RemarksAr
        //       )
        //     ) {
        //     } else {
        //       throw new Error("Remarks Arabic Validation Failed");
        //     }
        //   },
        // },
      },
      MiniumumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Miniumum Jockey Weight Of Jockey" },
          notEmpty: {
            msg: "Without Miniumum Jockey Weight Jockey Will not get submitted",
          },
        },
      },
      MaximumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Maximum Jockey Weight Of Jockey" },
          notEmpty: {
            msg: "Without Maximum Jockey Weight Jockey Will not get submitted",
          },
        },
      },
      JockeyAllowance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Jockey Allowance Of Jockey" },
          notEmpty: {
            msg: "Without Jockey Allowance Jockey Will not get submitted",
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

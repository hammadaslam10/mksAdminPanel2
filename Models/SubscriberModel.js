const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  const SubscriberModel = sequelize.define(
    "SubscriberModel",
    //dob address
    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PassportNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ApprovedStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Subscriber" },
          notEmpty: {
            msg: "Without Nationality Subscriber Will not get submitted",
          },
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Subscriber" },
          notEmpty: {
            msg: "Without Date of birth Subscriber Will not get submitted",
          },
        },
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true,
      },
      PhoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      PassportPicture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Token: {
        type: DataTypes.STRING,
      },
      // TokenDate: {
      //   type: DataTypes.DATE,
      // },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );

  SubscriberModel.prototype.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  SubscriberModel.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  SubscriberModel.prototype.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  };
  {
    Hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          user.password = bcrypt.hashSync(user.password, salt);
        }
      };
    }
  }
  return SubscriberModel;
};

// SubscriberModel.prototype.hash(async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
// });

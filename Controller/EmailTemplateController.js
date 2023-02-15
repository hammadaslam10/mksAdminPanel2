const db = require("../config/Connection");
const EmailTemplateModel = db.EmailTemplateModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Op } = require("sequelize");
exports.GetDeletedEmailTemplate = Trackerror(async (req, res, next) => {
  const data = await EmailTemplateModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null },
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RestoreSoftDeletedEmailTemplate = Trackerror(async (req, res, next) => {
  const data = await EmailTemplateModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await EmailTemplateModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateEmailTemplate = Trackerror(async (req, res, next) => {
  const { TemplateName, Subject, Html, Target } = req.body;

  const data = await EmailTemplateModel.create({
    TemplateName: TemplateName,
    Subject: Subject,
    Html: Html,
    Target: Target,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.EmailTemplateGet = Trackerror(async (req, res, next) => {
  const data = await EmailTemplateModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetEmailTemplateAdmin = Trackerror(async (req, res, next) => {});
exports.EditEmailTemplate = Trackerror(async (req, res, next) => {
  const { TemplateName, Subject, Html, Target } = req.body;
  let data = await EmailTemplateModel.findOne({
    where: { _id: req.params.id },
  });
  try {
    if (data === null) {
      return next(new HandlerCallBack("data not found", 404));
    }
    const updateddata = {
      TemplateName: TemplateName || data.TemplateName,
      Subject: Subject || data.Subject,
      Html: Html || data.Html,
      Target: Target || data.Target,
    };
    data = await EmailTemplateModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
    }
  }
});
exports.DeleteEmailTemplate = Trackerror(async (req, res, next) => {
  const data = await EmailTemplateModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await EmailTemplateModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteEmailTemplate = Trackerror(async (req, res, next) => {
  const data = await EmailTemplateModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await EmailTemplateModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});

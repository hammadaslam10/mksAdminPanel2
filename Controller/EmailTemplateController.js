const db = require("../config/Connection");
const EmailTemplateModel = db.EmailTemplateModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");

exports.CreateEmailTemplate = Trackerror(async (req, res, next) => {
  const { TemplateName, Subject } = req.body;

  const data = await EmailTemplateModel.create({
    TemplateName: TemplateName,
    Subject: Subject,
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
  const { TemplateName, Subject, shortCode } = req.body;
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
      res.send({ status: "error", message: "This Short Code already exists, Please enter a different one." });
    } else {
      res.status(500);
      res.send({ status: "error", message: "Something went wrong" });
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

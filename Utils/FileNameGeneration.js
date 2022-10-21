const crypto = require("crypto");
exports.generateFileName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

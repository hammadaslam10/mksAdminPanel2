const sharp = require("sharp");
exports.resizeImageBuffer = async (imageBuffer, width, height) => {
  const sharpImg = await sharp(imageBuffer);
  return sharpImg
    .resize({
      width: width,
      height: height,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer();
};

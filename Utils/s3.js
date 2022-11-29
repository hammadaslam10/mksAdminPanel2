const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config({ path: "./config/Secrets.env" });
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

exports.uploadFile = (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  };
  console.log(uploadParams);
  return s3Client.send(new PutObjectCommand(uploadParams));
};

exports.deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName
  };
  console.log(deleteParams);

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

exports.getObjectSignedUrl = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  const command = new GetObjectCommand(params);
  const seconds = 86400;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  return url;
};

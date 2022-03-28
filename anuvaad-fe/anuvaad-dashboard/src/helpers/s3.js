var S3_CREDENTIALS = require("aws-sdk/clients/s3");

const config = new S3_CREDENTIALS({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY_ID,
  region: process.env.REACT_APP_S3_REGION
});

const S3 = {
  uploadFile(file, fileName, fileType) {
    if (file != null) {
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: fileName,
        Body: file,
        ContentType: fileType,
        ACL: "public-read"
      };
      config.upload(params, function(err, data) {
        if (err) {
          // Notify.error(err);
          throw err;
        }

        localStorage.setItem("fileURL", `${data.Location}`);
        // console.log(`File uploaded successfully. ${data.Location}`);
      });
      return true;
    }
  },

  deleteFile(fileName) {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: fileName
    };
    config.deleteObject(params, function(err, data) {
      if (err) {
        throw err;
      }
      // console.log(`File deleted successfully.`);
    });
  }
};

export default S3;

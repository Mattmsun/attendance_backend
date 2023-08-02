const multer = require("multer");
var fs = require("fs");

const sharp = require("sharp");
const config = require("config");
const host = config.get("host");
const OSS = require("ali-oss");
const path = require("path");

const client = new OSS({
  // 以华南3（广州）为例，region填写为oss-cn-guangzhou。
  region: "oss-cn-beijing",

  // 填写AK和AS
  accessKeyId: config.get("accessKey"),
  accessKeySecret: config.get("accessSecret"),
  // accessKeyId: "LTAI5tHtianhLpdUexjdHNL3",
  // accessKeySecret: "DHaetq8vph9wf3lgKXEQH5T64hPmW3",
  // 填写待配置跨域资源共享规则的Bucket名称。
  bucket: "attendance-chen",

  endpoint: "oss-cn-beijing.aliyuncs.com",
});

async function putImage(filePath, localPath) {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put(
      filePath,
      localPath
      // 自定义headers
      //,{headers}
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}
const storage = () => multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  // Accept images only
  if (
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/webp"
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

module.exports = {
  storeActivityImage: function (req, res, next) {
    var upload = multer({
      storage: storage(),
      fileFilter: fileFilter,
    }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log("error");
        return res.status(400).send({ message: "something wrong" });
      } else if (err) {
        console.log(err);
        return res.status(400).send({ message: req.fileValidationError });
      }
      let type = req.file.originalname.replace(/.+\./, ".");
      const imageName = req.body.name + "_" + Date.now() + "_" + type;
      // const path = `./public/activityImages/${imageName}`;

      const activityImage = `public/activityImages/${imageName}`;
      const activityImagePath = path.join(__dirname, "../", activityImage);

      await sharp(req.file.buffer).resize(750, 420).toFile(activityImage);
      putImage(activityImage, activityImagePath);
      req.image = {
        image_path: host + "./" + activityImage,
      };
      next();

      // 一切都好
    });
  },
  storeUserImage: function (req, res, next) {
    var upload = multer({
      storage: storage(),
      fileFilter: fileFilter,
    }).single("image");

    upload(req, res, async function (err) {
      if (req.file) {
        if (err instanceof multer.MulterError) {
          console.log("error");
          return res.status(400).send({ message: "something wrong" });
        } else if (err) {
          console.log(err);
          return res.status(400).send({ message: req.fileValidationError });
        }
        let type = req.file.originalname.replace(/.+\./, ".");
        const imageName = req.body.name + "_" + Date.now() + "_" + type;
        // const path = `./public/userImages/${imageName}`;

        const userImage = `public/userImages/${imageName}`;
        const userImagePath = path.join(__dirname, "../", userImage);
        await sharp(req.file.buffer).resize(100, 100).toFile(userImage);

        putImage(userImage, userImagePath);
        // return fs.unlinkSync(`${__dirname}../${result.name}`); // __dirname：当前文件所在目录

        req.image = {
          image_path: host + "./" + userImage,
        };
      } else {
        req.image = {
          image_path: "",
        };
      }

      next();
      // 一切都好
    });
  },
};

const multer = require("multer");
const sharp = require("sharp");
const config = require("config");
const host = config.get("host");

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
      const path = `./public/activityImages/${imageName}`;

      await sharp(req.file.buffer).resize(750, 420).toFile(path);
      req.image = {
        image_path: host + path,
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
        const path = `./public/userImages/${imageName}`;
        await sharp(req.file.buffer).resize(800, 800).toFile(path);

        req.image = {
          image_path: host + path,
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

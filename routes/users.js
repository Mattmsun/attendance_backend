const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const { User, validate } = require("../models/user");
const image = require("../middleware/storeImage");
var random = require("../utils/randomUser");
const auth = require("../middleware/auth");
var fs = require("fs");
const { Attendance } = require("../models/attendance");

//update user
router.post("/", image.storeUserImage, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, userId } = req.body;
  const { image_path } = req.image;
  let user = await User.findById(userId);
  if (!user) res.status(404).send("no user found");

  if (!image_path) {
    await Attendance.updateMany({ "user._id": userId }, { "user.name": name });
    user.name = name;
  } else {
    if (user.image) {
      const path = `public/userImages${
        user.image.split("public/userImages")[1]
      }`;
      fs.stat(path, function (err, stats) {
        // console.log(stats); //here we got all information of file in stats variable
        if (err) {
          return console.error(err);
        }
        fs.unlink(path, function (err) {
          if (err) return console.log(err);
          // console.log("file deleted successfully");
        });
      });
    }
    await Attendance.updateMany(
      { "user._id": userId },
      { "user.name": name, "user.image": image_path }
    );

    user.name = name;
    user.image = image_path;
  }
  user = await user.save();

  res.send(user);
});

router.get("/login", async (req, res) => {
  const { code } = req.query;
  try {
    //获取openid
    const {
      data: { openid },
    } = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${config.get(
        "appId"
      )}&secret=${config.get(
        "key"
      )}&js_code=${code}&grant_type=authorization_code`
    );

    let user = await User.findOne({ openid: openid });

    //如果用户第一次登入 新建用户
    if (!user) {
      user = new User({
        name: random("微信用户", 5),
        openid,
      });
      try {
        user = await user.save();
      } catch (error) {
        console.log("error", error);
        res.status(401).send("something wrong");
      }
    }

    res.send(user);
  } catch (error) {
    console.log("error", error);
    res.status(401).send("something wrong");
  }
});

router.post("/names", auth, async (req, res) => {
  // const users = await User.find({ admin: false }).sort("name");
  const users = await User.find().sort("name");

  res.send(users);
});

module.exports = router;

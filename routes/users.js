const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const { User, validate } = require("../models/user");
const image = require("../middleware/storeImage");
var random = require("../utils/randomUser");

//update user
router.post("/", image.storeUserImage, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, openid } = req.body;
  const { image_path } = req.image;
  let user;
  if (!image_path) {
    user = await User.findOneAndUpdate({ openid }, { name }, { new: true });
  } else {
    user = await User.findOneAndUpdate(
      { openid },
      { name, image: image_path },
      { new: true }
    );
  }

  if (!user) res.status(404).send("no user found");
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

module.exports = router;

const { Activity, validate, validateUser } = require("../models/activity");
const { Attendance } = require("../models/attendance");

const express = require("express");
const router = express.Router();

const image = require("../middleware/storeImage");
const auth = require("../middleware/auth");
var fs = require("fs");
const { getMongodbDateFormat } = require("../utils/date");
//根据用户获取单项活动
router.post("/singleActivity/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const activityId = req.params.id;
  const attendance = await Attendance.findOne({
    "user._id": req.body.userId,
    "activity._id": activityId,
  });

  //返回用户报名过的活动
  if (attendance) return res.send(attendance);
  //返回用户未参加的活动
  const activity = await Activity.findById(activityId);
  res.send(activity);
});

//获取用户报名过的活动
router.post("/signedup", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const attendance = await Attendance.find({ "user._id": req.body.userId });
  // await Activity.
  res.send(attendance);
});

//新建活动
router.post("/", [image.storeActivityImage, auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const {
    name,
    desc,
    startDate,
    endDate,
    location,
    latitude,
    longitude,
    attendanceStartTime,
    attendanceEndTime,
  } = req.body;
  // return console.log(getMongodbDateFormat(startDate));
  const { image_path } = req.image;
  let activity = new Activity({
    name,
    activityImage: image_path,
    desc,
    startDate: getMongodbDateFormat(startDate),
    endDate: getMongodbDateFormat(endDate),
    // startDate,
    // endDate,
    attendanceStartTime,
    attendanceEndTime,
    location: {
      name: location,
      latitude,
      longitude,
    },
  });
  activity = await activity.save();
  res.send(activity);
});

//获取全部活动
router.get("/", async (req, res) => {
  const activities = await Activity.find().sort("name");
  res.send(activities);
});

router.delete("/:id", auth, async (req, res) => {
  let activity = await Activity.findOne({ _id: req.params.id });
  if (!activity) return res.status(404).send("no user found");

  const path = activity.activityImage.split("./")[1];
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

  await Activity.deleteOne({ _id: req.params.id });
  const attendance = await Attendance.deleteMany({
    "activity._id": req.params.id,
  });
  res.status(200).send({ message: `${req.params.id},delete successfully` });
});

router.get("/:id", async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) res.status(404).send("no activity found");
  res.send(activity);
});

module.exports = router;

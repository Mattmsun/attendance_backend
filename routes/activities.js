const { Activity, validate, validateUser } = require("../models/activity");
const { Attendance } = require("../models/attendance");

const express = require("express");
const router = express.Router();

const image = require("../middleware/storeImage");

//获取全部活动
router.get("/", async (req, res) => {
  const activities = await Activity.find().sort("name");
  res.send(activities);
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

//根据用户获取单项活动
router.post("/single/:id", async (req, res) => {
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
  //返回用户为参加的活动
  const activity = await Activity.findById(activityId);
  res.send(activity);
});

//新建活动
router.post("/", image.storeActivityImage, async (req, res) => {
  // console.log(req.body.location.latitude);
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
  const { image_path } = req.image;
  let activity = new Activity({
    name,
    activityImage: image_path,
    desc,
    startDate,
    endDate,
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

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const activity = await Activity.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!activity) res.status(404).send("no activity found");
  res.send(activity);
});

router.delete(":/id", async (req, res) => {
  const activity = await Activity.findByIdAndRemove(req.params.id);
  if (!activity) res.status(404).send("no activity found");
  res.send(activity);
});

router.get("/:id", async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) res.status(404).send("no activity found");
  res.send(activity);
});

module.exports = router;

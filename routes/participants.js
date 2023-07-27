const { Participant, validate } = require("../models/participant");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const participants = await Participant.find().sort("name");
  res.send(participants);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let participant = new Participant({
    name: req.body.name,
  });
  participant = await participant.save();
  res.send(participant);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const participant = await Participant.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!participant) res.status(404).send("no participant found");
  res.send(participant);
});

router.delete(":/id", async (req, res) => {
  const participant = await Participant.findByIdAndRemove(req.params.id);
  if (!participant) res.status(404).send("no participant found");
  res.send(participant);
});

router.get("/:id", async (req, res) => {
  const participant = await Participant.findById(req.params.id);
  if (!participant) res.status(404).send("no participant found");
  res.send(participant);
});
module.exports = router;

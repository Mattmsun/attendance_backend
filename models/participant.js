const mongoose = require("mongoose");
const Joi = require("joi");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Participant = mongoose.model("Participant", participantSchema);
function validateParticipant(participant) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(participant);
}
exports.participantSchema = participantSchema;
exports.Participant = Participant;
exports.validate = validateParticipant;

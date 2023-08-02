const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  openid: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.any(),
    userId: Joi.objectId().required(),
  });
  return schema.validate(user);
}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;

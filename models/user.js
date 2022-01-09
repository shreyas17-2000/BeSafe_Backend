const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 2000,
    },
    userDetails: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");

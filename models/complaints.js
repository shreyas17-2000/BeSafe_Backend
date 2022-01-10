const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  complaints: {
    type: Array,
    default: [],
    complaint: {
      type: Object,
      required: true,
      unique: true,
      reason: {
        type: String,
        required: true,
      },
      complaintType: {
        type: String,
        required: true,
      },
      location: {
        name: {
          type: String,
          required: true,
        },
      },
      proof: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: "In Queue",
      },
      assignTo: {
        type: String,
      },
      time: { type: Date, default: Date.now() },
    },
  },
});

module.exports = mongoose.model("Complaint", complaintSchema, "complaints");
// 1st:ourname
// 2nd:structurname
// 3rd:mongodatabasename
// name: {
//   type: String,
//   required: true,
// },
// Citizenid: {
//   from: "",
//   to: "",
//   type: String,
//   required: true,
//   unique: true,
// },
// location: {
//   type: String,
//   required: true,
// },
// reason: {
//   type: String,
//   required: true,
// },
// document: {
//   type: Number,
//   default: 2000,
// },
// type: {
//   type: Number,
//   default: 2000,
// },
// details: {
//   type: Number,
//   default: 2000,
// },
// location: {},
// policeId: {},
// },

const Joi = require("joi");
const Complaint = require("../models/complaints");
const missingPerson = require("../models/missingPerson");
const mslf = require("../models/mslf");
const unIdPerson = require("../models/unIdPerson");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const AssignPoliceController = {
  async assignReportPolice(req, res, next) {
    const { role } = req.user;
    const assignSchema = Joi.object({
      assignName: Joi.string().required(),
      assignTo: Joi.string().required(),
      _id: Joi.string().required(),
    });
    const { error } = assignSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { assignName, _id, assignTo } = req.body;
    let myComplaints;
    try {
      if (role === 4000) {
        myComplaints = await Complaint.updateOne(
          { "complaints._id": _id },
          {
            $set: {
              "complaints.$.assignTo": assignTo,
              "complaints.$.assignName": assignName,
            },
          }
        );
        req.io.emit("statusUpdated", { success: true });
        return res.json(myComplaints);
      }
    } catch (error) {
      next(error);
    }
  },
  async assignMissing(req, res, next) {
    const { role } = req.user;
    const assignSchema = Joi.object({
      assignName: Joi.string().required(),
      assignTo: Joi.string().required(),
      _id: Joi.string().required(),
    });
    const { error } = assignSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { assignName, _id, assignTo } = req.body;
    let myComplaints;
    try {
      if (role === 4000) {
        myComplaints = await missingPerson.updateOne(
          { "missingPerson._id": _id },
          {
            $set: {
              "missingPerson.$.assignTo": assignTo,
              "missingPerson.$.assignName": assignName,
            },
          }
        );
        req.io.emit("statusUpdated", { success: true });
        return res.json(myComplaints);
      }
    } catch (error) {
      next(error);
    }
  },
  async assignMslf(req, res, next) {
    const { role } = req.user;
    const assignSchema = Joi.object({
      assignName: Joi.string().required(),
      assignTo: Joi.string().required(),
      _id: Joi.string().required(),
    });
    const { error } = assignSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { assignName, _id, assignTo } = req.body;
    let myComplaints;
    try {
      if (role === 4000) {
        myComplaints = await mslf.updateOne(
          { "mslf._id": _id },
          {
            $set: {
              "mslf.$.assignTo": assignTo,
              "mslf.$.assignName": assignName,
            },
          }
        );
        req.io.emit("statusUpdated", { success: true });
        return res.json(myComplaints);
      }
    } catch (error) {
      next(error);
    }
  },
  async assignUnIdPerson(req, res, next) {
    const { role } = req.user;
    const assignSchema = Joi.object({
      assignName: Joi.string().required(),
      assignTo: Joi.string().required(),
      _id: Joi.string().required(),
    });
    const { error } = assignSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { assignName, _id, assignTo } = req.body;
    let myComplaints;
    try {
      if (role === 4000) {
        myComplaints = await unIdPerson.updateOne(
          { "unIdPerson._id": _id },
          {
            $set: {
              "unIdPerson.$.assignTo": assignTo,
              "unIdPerson.$.assignName": assignName,
            },
          }
        );
        req.io.emit("statusUpdated", { success: true });
        return res.json(myComplaints);
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = AssignPoliceController;

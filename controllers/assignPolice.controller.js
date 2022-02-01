const Joi = require("joi");
const Complaint = require("../models/complaints");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const AssignPoliceController = {
  async assignPolice(req, res, next) {
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
};
module.exports = AssignPoliceController;

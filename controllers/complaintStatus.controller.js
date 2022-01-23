const Joi = require("joi");
const Complaint = require("../models/complaints");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const ComplaintStatusController = {
  async updateStatus(req, res, next) {
    const { role } = req.user;
    const { status, _id } = req.body;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await Complaint.updateOne(
          { "complaints._id": _id },
          {
            $set: {
              "complaints.$.status": status,
            },
          }
        );
        return res.json({
          myComplaints,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = ComplaintStatusController;

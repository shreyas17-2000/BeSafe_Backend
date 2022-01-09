const Joi = require("joi");
const Complaint = require("../models/complaints");
const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const complaintsController = {
  async getComplaints(req, res) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await Complaint.find(
          {
            complaints: { $elemMatch: { assignTo: _id } },
          },
          { "complaints.$": 1 }
        );
        return res.json({
          myComplaints,
        });
      }
      if (role === 3000) {
        myComplaints = await Complaint.find(
          {
            complaints: { $elemMatch: { location: { name: req.station } } },
          },
          { "complaints.$": 1 }
        );
        return res.json({
          myComplaints,
        });
      }
      myComplaints = await Complaint.findOne({
        userId: _id,
      });
      if (!myComplaints) {
        return res.json({});
      }
    } catch (error) {
      return next(error);
    }
    return res.json({
      myComplaints,
    });
  },
  async postComplaints(req, res, next) {
    const { _id, role } = req.user;
    const complaintSchema = Joi.object({
      reason: Joi.string().min(3).max(250).required(),
      complaintType: Joi.string().min(3).max(250).required(),
      location: Joi.object({
        name: Joi.string().required(),
      }),
      proof: Joi.string().min(3).required(),
    });
    const { error } = complaintSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { reason, complaintType, location, proof } = req.body;
    const newComplaint = {
      reason,
      complaintType,
      location,
      proof,
    };
    let complaints;
    let addComplaint;
    try {
      complaints = await Complaint.findOne({
        userId: _id,
      });
      if (!complaints) {
        const complaint = await new Complaint({
          userId: _id,
          complaints: newComplaint,
        });
        const result = await complaint.save();
        return res.json({
          result,
        });
      }
      addComplaint = await Complaint.findOneAndUpdate(_id, {
        $push: {
          complaints: newComplaint,
        },
      });
    } catch (err) {
      return next(err);
    }
    return res.json({
      addComplaint,
    });
  },
};

module.exports = complaintsController;

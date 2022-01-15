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
      if (role === 4000) {
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
      complaintAgaints: Joi.string().max(3).max(250).required(),
      reason: Joi.string().min(3).max(250).required(),
      complaintType: Joi.string().min(3).max(250).required(),
      locationName: Joi.string(),
      locationAddress: Joi.string(),
      currentSituation: Joi.string(),
      nearestPoliceStation: Joi.string(),
      nearestPoliceStationAddress: Joi.string(),
      images: Joi.array().items(Joi.string()),
    });
    const { error } = complaintSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    let complaints;
    let addComplaint;
    try {
      complaints = await Complaint.findOne({
        userId: _id,
      });
      if (!complaints) {
        const complaint = await new Complaint({
          userId: _id,
          complaints: req.body,
        });
        const result = await complaint.save();
        return res.json({
          result,
        });
      }
      addComplaint = await Complaint.findOneAndUpdate(
        {
          userId: _id,
        },
        {
          $push: {
            complaints: req.body,
          },
        }
      );
    } catch (err) {
      return next(err);
    }
    return res.json({
      addComplaint,
    });
  },
};

module.exports = complaintsController;

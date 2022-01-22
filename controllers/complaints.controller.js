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
      myComplaints = await Complaint.find({
        $or: [
          { userId: _id },
          {
            complaints: { $elemMatch: { complaintAgainst: _id } },
          },
        ],
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
    const Data = JSON.parse(req.body.data);
    const { _id, role } = req.user;
    const complaintSchema = Joi.object({
      complaintAgainstName: Joi.string().max(3).max(250).required(),
      complaintAgainst: Joi.string().max(3).max(250).required(),
      reason: Joi.string().min(3).max(250).required(),
      complaintType: Joi.string().min(3).max(250).required(),
      locationName: Joi.string().required(),
      locationAddress: Joi.string().required(),
      currentSituation: Joi.string().required(),
      nearestPoliceStation: Joi.string().required(),
      nearestPoliceStationAddress: Joi.string().required(),
    });
    const { error } = complaintSchema.validate(Data);
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
          complaints: { ...Data, images: req.urls },
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
            complaints: { ...Data, images: req.urls },
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

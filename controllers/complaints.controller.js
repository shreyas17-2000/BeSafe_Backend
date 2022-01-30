const Joi = require("joi");
const Complaint = require("../models/complaints");

const complaintsController = {
  async getComplaints(req, res, next) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await Complaint.find({
          $or: [
            {
              userId: _id,
              complaints: {
                $elemMatch: { status: { $ne: "Solved" } },
              },
            },
            {
              complaints: {
                $elemMatch: { status: { $ne: "Solved" }, assignTo: _id },
              },
            },
          ],
        });
      } else if (role === 4000) {
        myComplaints = await Complaint.find(
          {
            complaints: {
              $elemMatch: {
                nearestPoliceStationAddress: req.station,
                status: { $ne: "Solved" },
              },
            },
          },
          { "complaints.$": 1 }
        );
      } else if (role === 3000) {
        myComplaints = await Complaint.find({
          $or: [
            { userId: _id },
            {
              complaints: {
                $elemMatch: {
                  complaintAgainst: _id,
                  status: { $nin: ["Solved"] },
                },
              },
            },
          ],
        });
      }
      console.log(myComplaints);
      if (!myComplaints) {
        req.io.emit("getComplaints", {
          success: true,
          myComplaints: [],
        });
      }
      res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
  async ComplaintsHistory(req, res, next) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await Complaint.find({
          $or: [
            {
              userId: _id,
              complaints: {
                $elemMatch: { status: "Solved" },
              },
            },
            {
              complaints: {
                $elemMatch: { assignTo: _id, status: "Solved" },
              },
            },
          ],
        });
      } else if (role === 4000) {
        myComplaints = await Complaint.find(
          {
            complaints: {
              $elemMatch: {
                nearestPoliceStationAddress: req.station,
                status: "Solved",
              },
            },
          },
          { "complaints.$": 1 }
        );
      } else if (role === 3000) {
        myComplaints = await Complaint.find({
          $or: [
            {
              userId: _id,
              complaints: {
                $elemMatch: { status: "Solved" },
              },
            },
            {
              complaints: {
                $elemMatch: {
                  complaintAgainst: _id,
                  status: "Solved",
                },
              },
            },
          ],
        });
      }
      req.io.emit("ComplaintsHistory", {
        success: true,
        myComplaints,
      });
      res.json({ success: true, myComplaints });
    } catch (error) {
      return next(error);
    }
  },
  async postComplaints(req, res, next) {
    const Data = JSON.parse(req.body.data);
    const { _id, role } = req.user;
    const complaintSchema = Joi.object({
      complaintAgainstName: Joi.string().max(3).max(250).required(),
      complaintAgainst: Joi.string().max(3).max(250).required(),
      reason: Joi.string().min(3).required(),
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
          success: true,
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

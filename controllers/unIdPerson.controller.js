const Joi = require("joi");
const unIdPerson = require("../models/unIdPerson");

const unIdPersonController = {
  async unIdPerson(req, res, next) {
    const { _id } = req.user;
    const data = JSON.parse(req.body.data);
    const unIdPersonSchema = Joi.object({
      incidenceDesc: Joi.string().required(),
      dateFrom: Joi.string().required(),
      dateTo: Joi.string().required(),
      height: Joi.string().required(),
      sex: Joi.string().required(),
      locName: Joi.string().required(),
      locAddress: Joi.string().required(),
      stationName: Joi.string().required(),
      stationAddress: Joi.string().required(),
      upperDressColor: Joi.string().required(),
      lowerDressColor: Joi.string().required(),
      faceCutWithColor: Joi.string().required(),
      hairCutWithColor: Joi.string().required(),
      eyes: Joi.string().required(),
      reportFor: Joi.string().required(),
      expectedAge: Joi.string().required(),
    });
    const { error } = unIdPersonSchema.validate(data);
    if (error) {
      next(error);
    }
    let complaints;
    let addComplaint;
    try {
      complaints = await unIdPerson.findOne({
        userId: _id,
      });
      if (!complaints) {
        const complaint = await new unIdPerson({
          userId: _id,
          unIdPerson: { ...data, images: req.urls },
        });
        const result = await complaint.save();
        return res.json({
          success: true,
          result,
        });
      } else {
        addComplaint = await unIdPerson.findOneAndUpdate(
          {
            userId: _id,
          },
          {
            $push: {
              unIdPerson: { ...data, images: req.urls },
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    return res.json({
      success: true,
      addComplaint,
    });
  },
  async getUnIdPerson(req, res, next) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await unIdPerson.find({
          $or: [
            {
              userId: _id,
              unIdPerson: { $elemMatch: { status: { $ne: "Solved" } } },
            },
            {
              unIdPerson: {
                $elemMatch: { assignTo: _id, status: { $ne: "Solved" } },
              },
            },
          ],
        });
      } else if (role === 4000) {
        myComplaints = await unIdPerson.find(
          {
            unIdPerson: {
              $elemMatch: {
                stationAddress: req.station,
                status: { $ne: "Solved" },
              },
            },
          },
          { "complaints.$": 1 }
        );
      } else if (role === 3000) {
        myComplaints = await unIdPerson.find({
          $or: [
            {
              userId: _id,
              unIdPerson: { $elemMatch: { status: { $ne: "Solved" } } },
            },
          ],
        });
      }
      req.io.emit("getUnIdPerson", {
        success: true,
        myComplaints,
      });
      res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
  async UnIdPersonHistory(req, res, next) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await unIdPerson.find({
          $or: [
            {
              userId: _id,
              unIdPerson: {
                $elemMatch: { status: "Solved" },
              },
            },
            {
              unIdPerson: { $elemMatch: { assignTo: _id, status: "Solved" } },
            },
          ],
        });
      } else if (role === 4000) {
        myComplaints = await unIdPerson.find(
          {
            unIdPerson: {
              $elemMatch: { stationAddress: req.station, status: "Solved" },
            },
          },
          { "complaints.$": 1 }
        );
      } else if (role === 3000) {
        myComplaints = await unIdPerson.find({
          $or: [
            {
              userId: _id,
              unIdPerson: {
                $elemMatch: { status: "Solved" },
              },
            },
          ],
        });
      }
      req.io.emit("UnIdPersonHistory", {
        success: true,
        myComplaints,
      });
      res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = unIdPersonController;

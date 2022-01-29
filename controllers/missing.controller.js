const Joi = require("joi");
const missingPerson = require("../models/missingPerson");

const missingController = {
  async missingPerson(req, res, next) {
    const { _id } = req.user;
    const data = JSON.parse(req.body.data);
    const missingPersonSchema = Joi.object({
      dateFrom: Joi.string().required(),
      dateTo: Joi.string().required(),
      name: Joi.string().required(),
      fatherName: Joi.string().required(),
      height: Joi.string().required(),
      religion: Joi.string().required(),
      sex: Joi.string().required(),
      locName: Joi.string().required(),
      locAddress: Joi.string().required(),
      stationName: Joi.string().required(),
      stationAddress: Joi.string().required(),
      age: Joi.string().required(),
    });
    const { error } = missingPersonSchema.validate(data);
    if (error) {
      next(error);
    }
    let complaints;
    let addComplaint;
    try {
      complaints = await missingPerson.findOne({
        userId: _id,
      });
      if (!complaints) {
        const complaint = await new missingPerson({
          userId: _id,
          missingPerson: { ...data, images: req.urls },
        });
        const result = await complaint.save();
        return res.json({
          success: true,
          result,
        });
      } else {
        addComplaint = await missingPerson.findOneAndUpdate(
          {
            userId: _id,
          },
          {
            $push: {
              missingPerson: { ...data, images: req.urls },
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
  async getmissingPerson(req, res, next) {
    const { _id, role } = req.user;
    let myComplaints;
    try {
      if (role === 5000) {
        myComplaints = await missingPerson.find({
          $or: [
            { userId: _id },
            {
              missingPerson: { $elemMatch: { assignTo: _id } },
            },
          ],
        });
      } else if (role === 4000) {
        myComplaints = await missingPerson.find(
          {
            missingPerson: {
              $elemMatch: { stationAddress: req.station },
            },
          },
          { "complaints.$": 1 }
        );
      } else if (role === 3000) {
        myComplaints = await missingPerson.find({ userId: _id });
      }
      req.io.emit("getmslf", {
        success: true,
        myComplaints,
      });
      res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = missingController;

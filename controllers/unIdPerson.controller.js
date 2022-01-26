const Joi = require("joi");
const unIdPerson = require("../models/unIdPerson");

const unIdPersonController = {
  async unIdPerson(req, res, next) {
    const { _id } = req.user;
    const data = JSON.parse(req.body.data);
    const unIdPersonSchema = Joi.object({
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
};

module.exports = unIdPersonController;

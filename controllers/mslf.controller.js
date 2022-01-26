const Joi = require("joi");
const mslf = require("../models/mslf");

const mslfController = {
  async mslf(req, res, next) {
    const { _id } = req.user;
    const data = JSON.parse(req.body.data);
    const mslfSchema = Joi.object({
      dateFrom: Joi.string().required(),
      dateTo: Joi.string().required(),
      stationName: Joi.string().required(),
      stationAddress: Joi.string().required(),
      reportFor: Joi.string().required(),
      lostLocName: Joi.string().required(),
      lostLocAddress: Joi.string().required(),
      thingDesc: Joi.string().required(),
      thingName: Joi.string().required(),
    });
    const { error } = mslfSchema.validate(data);
    if (error) {
      next(error);
    }
    let complaints;
    let addComplaint;
    try {
      complaints = await mslf.findOne({
        userId: _id,
      });
      if (!complaints) {
        const complaint = await new mslf({
          userId: _id,
          mslf: { ...data, images: req.urls },
        });
        const result = await complaint.save();
        return res.json({
          success: true,
          result,
        });
      } else {
        addComplaint = await mslf.findOneAndUpdate(
          {
            userId: _id,
          },
          {
            $push: {
              mslf: { ...data, images: req.urls },
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

module.exports = mslfController;

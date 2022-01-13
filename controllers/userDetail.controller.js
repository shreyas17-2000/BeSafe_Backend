const User = require("../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const cloudinary = require("../services/imageUpload");

const userDetailController = {
  async citizenDetails(req, res, next) {
    const { _id, role } = req.user;
    if (role === 4000) {
      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30),
        adharCard: Joi.string().pattern(
          new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$")
        ),
        panCard: Joi.string().pattern(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")),
        dob: Joi.date(),
        address: Joi.string().min(3).max(300),
        occupation: Joi.string().min(3).max(30),
      });
      const { error } = registerSchema.validate(req.body);
      const { name, ...details } = req.body;

      //
      if (error) {
        return next(error);
      }

      const updateDetails = await User.findOneAndUpdate(
        { _id: _id },
        {
          name: name,
        },
        {
          userDetails: details,
        }
      );

      return res.json(req.body);
    }
  },
  async policeDetails(req, res, next) {
    const { _id, role } = req.user;
    console.log(req.body);
    if (role === 5000) {
      const policeInfoSchema = Joi.object({
        adharCard: Joi.string().pattern(
          new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$")
        ),
        panCard: Joi.string().pattern(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")),
        policeId: Joi.string().min(3).max(30),
        postingArea: Joi.string(),
        stationName: Joi.string().min(3).max(30),
        policePost: Joi.string().min(3).max(30),
        city: Joi.string(),
        dob: Joi.date(),
        address: Joi.string().min(3).max(300),
      });
      const { error } = policeInfoSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const {
        adharCard,
        panCard,
        policeId,
        postingArea,
        stationName,
        policePost,
        dob,
        address,
      } = req.body;

      const info = await User.findById(_id);

      const data = {
        adharCard: adharCard ? adharCard : info.userDetails.adharCard,
        panCard: panCard ? panCard : info.userDetails.panCard,
        policeId: policeId ? policeId : info.userDetails.policeId,
        postingArea: postingArea ? postingArea : info.userDetails.postingArea,
        stationName: stationName ? stationName : info.userDetails.stationName,
        policePost: policePost ? policePost : info.userDetails.policePost,
        dob: dob ? dob : info.userDetails.dob,
        address: address ? address : info.userDetails.address,
      };
      //
      const updateDetails = await User.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            userDetails: data,
          },
        }
      );

      return res.json(updateDetails);
    }
  },
  async uploadProfile(req, res, next) {
    const { _id, role } = req.user;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${_id}_profile`,
        width: 500,
        height: 500,
        crop: "fill",
      });
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { avatar: result.url },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Your profile has updated!",
        url: result.url,
      });
    } catch (error) {
      next(CustomErrorHandler.serverError());
    }
  },
};

module.exports = userDetailController;

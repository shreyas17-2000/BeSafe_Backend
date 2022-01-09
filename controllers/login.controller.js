const Joi = require("joi");
const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const { REFRESH_SECRET } = require("../config");
const RefreshToken = require("../models/refreshToken");

const loginController = {
  async login(req, res, next) {
    // validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      role: Joi.number().required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      if (user.role !== req.body.role) {
        return next(
          CustomErrorHandler.wrongCredentials(
            "Trying Sign In to Incorrect Role"
          )
        );
      }
      const tokens = await RefreshToken.findOne({
        userid: user._id,
      });
      //organize it
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      if (!tokens) {
        await RefreshToken.create({
          userid: user._id,
          refreshToken: refresh_token,
        });
        return res.json({
          success: true,
          access_token,
          refresh_token,
        });
      }
      await RefreshToken.findOneAndUpdate(user._id, {
        refreshToken: refresh_token,
      });
      return res.json({
        success: true,
        access_token,
        refresh_token,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = loginController;

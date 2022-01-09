const Joi = require("joi");
const User = require("../models/user");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const { REFRESH_SECRET } = require("../config");
const RefreshToken = require("../models/refreshToken");

const registerController = {
  async register(req, res, next) {
    //logic
    //validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirmPassword: Joi.ref("password"),
      role: Joi.number(),
    });
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if the user is already in the database
    try {
      const exits = await User.exists({
        email: req.body.email,
      });
      if (exits) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password, role } = req.body;
    if (![3000, 4000, 5000].includes(role)) {
      return next(
        CustomErrorHandler.wrongCredentials("Invalid Role was Found")
      );
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // prepare model

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const result = await user.save();
    let access_token;
    let refresh_token;
    try {
      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({
        userid: result._id,
        refreshToken: refresh_token,
      });
    } catch (err) {
      next(err);
    }
    res.json({
      sucess: true,
      access_token,
      refresh_token,
    });
  },
};

module.exports = registerController;

// {
//   stationnane:asdfg
//   location:;xsadsfgf
//   distance:lat long,
// }

// 19.028142288598588, 73.10131020930582

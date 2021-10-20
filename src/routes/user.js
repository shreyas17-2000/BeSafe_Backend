const express = require("express");
const { createUser, userSignIn } = require("../controllers/user");
const { isAuth } = require("../middleware/auth");
const {
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { validateUserSignUp } = require("../middleware/validation/user");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};

const uploads = multer({ storage, fileFilter });

const router = express.Router();

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/create-post", isAuth, (req, res) => {
  //create our post
  res.send("welcome you are in secret route");
});
router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;
    if (!user)
      return res
        .status(401)
        .json({ sucess: false, message: "unauthorized access" });

    try {
      const profileBuffer = req.file.buffer;
      const { width, height } = await sharp(profileBuffer).metadata();
      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();

      await User.findByIdAndUpdate(user._id, { avatar });
      res
        .status(201)
        .json({ success: true, message: "Your profile has updated" });
    } catch (error) {
      res
        .statusCode(500)
        .json({ success: false, message: "Server error try after some time" });
      console.log("error while uploading profile image", error.message);
    }
  }
);

module.exports = router;

const express = require("express");
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  AdminSignIn,
} = require("../controllers/user");
const { isAuth } = require("../middleware/auth");
const {
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { validateUserSignUp } = require("../middleware/validation/user");
const multer = require("multer");

const storage = multer.diskStorage({});

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
router.post("/admin-sign-in", validateUserSignIn, userValidation, AdminSignIn);
router.post("/create-post", isAuth, (req, res) => {
  //create our post
  res.send("welcome you are in secret route");
});
router.post(
  "/upload-profile",
  isAuth,
  uploads.single("profile"),
  uploadProfile
);

router.post("/sign-out", isAuth, signOut);

module.exports = router;

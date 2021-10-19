const express = require("express");
const { createUser, userSignIn } = require("../controllers/user");
const { isAuth } = require("../middleware/auth");
const {
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { validateUserSignUp } = require("../middleware/validation/user");

const router = express.Router();

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/create-post", isAuth, (req, res) => {
  //create our post
  res.send("welcome you are in secret route");
});

module.exports = router;

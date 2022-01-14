const express = require("express");
const {
  complaints,
  getComplaints,
  postComplaints,
} = require("../controllers/complaints.controller");
const { login } = require("../controllers/login.controller");
const { logout } = require("../controllers/logout.controller");
const { refresh } = require("../controllers/refreshToken.controller");
const { register } = require("../controllers/registerController");
const { me } = require("../controllers/user.controller");
const {
  citizenDetails,
  policeDetails,
  uploadProfile,
} = require("../controllers/userDetail.controller");
const auth = require("../middleware/auth.middleware");
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

// post
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", auth, logout);
router.post("/complaints", auth, postComplaints);
router.post("/upload-profile", auth, uploads.single("profile"), uploadProfile);

// router.post("/policeAdminAssignTo", auth, PoliceAdminAssignTo);

// citizen details
router.put("/citizenDetails", auth, citizenDetails);

// police details
router.put(
  "/policeDetails",
  auth,
  uploads.single("verification"),
  uploadVerification,
  policeDetails
);

async function uploadVerification(req, res, next) {
  const { _id, role } = req.user;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_verificationPaper`,
    });
    req.url = result.url;
    next();
  } catch (error) {
    next(CustomErrorHandler.serverError());
  }
}
// assign complaint
// router.put("/assignComplaint", auth,stationAdmin, );

// get
router.get("/mydetails", auth, me);
router.get("/complaints", auth, stationAdmin, getComplaints);

async function stationAdmin(req, res, next) {
  const { _id, role } = req.user;
  if (role === 4000) {
    const stationadmin = await User.findById(_id);
    req.station = stationadmin.userDetails.stationLocation;
    next();
  }
  next();
}

module.exports = router;

// user details
// police details view only to police admin
// get police Complaints

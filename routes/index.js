const express = require("express");
const {
  complaints,
  getComplaints,
  postComplaints,
} = require("../controllers/complaints.controller");
const { login, adminlogin } = require("../controllers/login.controller");
const { logout } = require("../controllers/logout.controller");
const { refresh } = require("../controllers/refreshToken.controller");
const {
  register,
  registerAdmin,
} = require("../controllers/registerController");
const {
  me,
  allUsers,
  getAllPolice,
} = require("../controllers/user.controller");
const {
  citizenDetails,
  policeDetails,
  uploadProfile,
} = require("../controllers/userDetail.controller");
const {
  cloudinary,
  cloudinaryImageUploadMethod,
} = require("../services/imageUpload");
const auth = require("../middleware/auth.middleware");
const multer = require("multer");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    next(CustomErrorHandler.wrongCredentials("invalid image file!"));
  }
};

const uploads = multer({ storage, fileFilter });

const router = express.Router();

// post
router.post("/register", register);
// router.post("/registerAdmin", registerAdmin);

router.post("/login", login);

router.post("/admin", adminlogin);
router.post("/refresh", refresh);
router.post("/logout", auth, logout);
router.post(
  "/complaints",
  auth,
  uploads.array("imageProof"),
  uploadComplaintProof,
  postComplaints
);
router.post("/upload-profile", auth, uploads.single("profile"), uploadProfile);
router.post(
  "/upload-verification",
  auth,
  uploads.single("verification"),
  uploadVerification
);

// router.post("/policeAdminAssignTo", auth, PoliceAdminAssignTo);

// citizen details
router.put("/citizenDetails", auth, citizenDetails);

// police details
router.put("/policeDetails", auth, policeDetails);

async function uploadComplaintProof(req, res, next) {
  const { _id, role } = req.user;
  try {
    const urls = [];
    const files = req.files;
    // const { _id, role } = req.user;
    for (const file of files) {
      const { path } = file;
      const { res } = await cloudinaryImageUploadMethod(path, _id);
      urls.push(res);
    }
    req.urls = urls;
    next();
  } catch (error) {
    next(CustomErrorHandler.serverError());
  }
}
async function uploadVerification(req, res, next) {
  const { _id, role } = req.user;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_verificationPaper`,
      folder: `verificationPaper/${_id}`,
    });
    res.json({ success: true, uri: result.url });
  } catch (error) {
    next(CustomErrorHandler.serverError());
  }
}
// assign complaint
// router.put("/assignComplaint", auth,stationAdmin, );

// get
router.get("/mydetails", auth, me);
router.get("/allusers", auth, allUsers);
router.get("/complaints", auth, stationAdmin, getComplaints);
router.get("/getAllPolice", auth, getAllPolice);

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

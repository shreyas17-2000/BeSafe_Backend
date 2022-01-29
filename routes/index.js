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
  getStationPolice,
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
const {
  saveExpoToken,
  sendPostNotifications,
} = require("../controllers/notification.controller");
const { updateStatus } = require("../controllers/complaintStatus.controller");
const User = require("../models/user");
const {
  missingPerson,
  getmissingPerson,
} = require("../controllers/missing.controller");
const {
  unIdPerson,
  getUnIdPerson,
} = require("../controllers/unIdPerson.controller");
const { mslf, getmslf } = require("../controllers/mslf.controller");
const io = require("../server");

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
router.put("/updateStatus", auth, updateStatus);
router.post(
  "/complaints",
  auth,
  uploads.array("imageProof"),
  uploadComplaintProof,
  postComplaints
);
router.post("/upload-profile", auth, uploads.single("profile"), uploadProfile);
router.post("/sendNoti", auth, sendPostNotifications);
router.post(
  "/missingPerson",
  auth,
  uploads.array("imageProof"),
  uploadComplaintProof,
  missingPerson
);
router.post(
  "/unIdPerson",
  auth,
  uploads.array("imageProof"),
  uploadComplaintProof,
  unIdPerson
);
router.post(
  "/mslf",
  auth,
  uploads.array("imageProof"),
  uploadComplaintProof,
  mslf
);
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
router.put("/expoTokens", auth, saveExpoToken);

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
router.get("/getMissingPerson", auth, stationAdmin, getmissingPerson);
router.get("/getmslf", auth, stationAdmin, getmslf);
router.get("/getUnIdPerson", auth, stationAdmin, getUnIdPerson);
router.get("/getAllPolice", getAllPolice);
router.get("/getStationPolice", auth, stationAdmin, getStationPolice);

async function stationAdmin(req, res, next) {
  const { _id, role } = req.user;
  if (role === 4000) {
    const stationadmin = await User.findById(_id);
    req.station = stationadmin.userDetails.postingAreaAddress;
  }
  next();
}

module.exports = router;

// user details
// police details view only to police admin
// get police Complaints

const express = require("express");
const multer = require('multer');
const {
  handleGenerateNewShortURL,
  getAnalytics,
  getUrl
} = require("../controllers/url");
const storage = multer.diskStorage({});
const upload = multer({ storage });
const {
  login,
  register,
  welcome,
  decodeJWT,
  generateOtp,
  otpValidation,
  resetPassword,
  handleuservalidation,
} = require("../controllers/auth");
const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.post("/validateuser",handleuservalidation)
router.get("/getanalytics/:shortId", getAnalytics);
router.post("/geturl", getUrl);
router.post("/login", login);
router.get("/welcome", welcome);
router.post("/decode", decodeJWT);
router.post("/validation", otpValidation);
router.post("/createnewotp", generateOtp);
router.post("/reset", resetPassword);
router.post("/register", upload.single('profile'), register);


module.exports = router;
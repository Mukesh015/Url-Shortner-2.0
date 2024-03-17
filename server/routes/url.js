const express = require("express");
const multer = require('multer');
const {
  handleGenerateNewShortURL,
  getAnalytics,
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
} = require("../controllers/auth");
const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/getanalytics/:shortId", getAnalytics);
router.post("/login", login);
router.get("/welcome", welcome);
router.post("/decode", decodeJWT);
router.post("/validation", otpValidation);
router.post("/createnewotp", generateOtp);
router.post("/reset", resetPassword);
router.post("/register", upload.single('profile'), register);

module.exports = router;

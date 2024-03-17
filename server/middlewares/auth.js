const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config({ path: "../.env" });
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const expire = process.env.JWT_EXPIRES_IN;

const signToken = (username, email, avatar) => {
  return jwt.sign(
    {
      username: username,
      email: email,
      avatar: avatar,
    },
    secretKey,
    {
      expiresIn: Date.now() + expire * 24 * 60 * 60 * 1000,
    }
  );
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken({
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  });
  if (user.password) user.password = undefined;
  const cookieOptions = {
    expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  cookieOptions.secure = true;
  res.cookie("cookie-1", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token: token,
  });
};

async function verifyToken(req, res, next) {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(200);
    }
    req.user = user;
    next();
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.sendotpusername,
    pass: process.env.sendotppassword,
  },
});

function isPasswordComplex(password) {

  const uppercaseRegex = /[A-Z]/;
  const numericRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  return (
    uppercaseRegex.test(password) &&
    numericRegex.test(password) &&
    specialCharRegex.test(password)
  );
}

module.exports = {
  createAndSendToken,
  verifyToken,
  transporter,
  isPasswordComplex,
};
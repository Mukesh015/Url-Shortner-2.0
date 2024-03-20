const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: Array,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: Array,
      required: true,
    },
    qrCodeUrl: {
      type: Array,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    otp: {
      required: false,
      type: Number,
    },
    shortId: {
      type: Array,
      required: false,
      unique: true,
    },
    redirectURL: {
      type: Array,
      required: false,
    },
    qrCodeUrl: {
      type: Array,
      required: false,
    },
    visitHistory: [[{ timestamp: { type: Number } }]],
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("users", UserSchema);
const URL = mongoose.model("url", urlSchema);

module.exports = {
  URL,
  UserModel,
};

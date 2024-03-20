const shortid = require("shortid");
const qr = require("qr-image");
const fs = require("fs");
const { UserModel } = require("../models/url");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  const email = body.email;
  console.log(email)
  console.log(body.url);
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortId = shortid();
  const shortUrl = `http://localhost:8010/redirect/${shortId}`;
  const qr_png = qr.imageSync(shortUrl, { type: "png" });

  try {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "qr_codes",
        },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to upload QR code" });
          }

          const qrCodeUrl = result.secure_url;

          try {
            // Update the existing user document to push the new URL information
            const updatedUser = await UserModel.updateOne(
              { email: email },
              {
                $push: {
                  shortId: shortId,
                  redirectURL: body.url,
                  qrCodeUrl: qrCodeUrl,
                },
              }
            );

            if (updatedUser.nModified === 0) {
              return res
                .status(400)
                .json({ message: "User not found or not updated" });
            }

            return res.json({ id: shortId, shorturl: shortUrl });
          } catch (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Failed to update user with new URL" });
          }
        }
      )
      .end(qr_png);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to upload QR code" });
  }
}

async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await UserModel.findOne({ shortId: shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function getUrl(req, res) {
  const { email } = req.body;
  console.log(email);
  try {
    const existUrl = await UserModel.findOne({ email: email });

    if (existUrl) {
      const keysToExtract = ["shortId", "qrCodeUrl", "redirectURL"];

      const extractedData = {};

      keysToExtract.forEach((key) => {
        if (existUrl[key] !== undefined) {
          extractedData[key] = existUrl[key];
        }
      });

      res.status(200).json(extractedData);
    } else {
      res.status(404).json({ msg: "No documents found" });
    }
  } catch (error) {
    console.error("Retrieve operation failed!", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = { handleGenerateNewShortURL, getAnalytics, getUrl };

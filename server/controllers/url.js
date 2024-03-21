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
  const { url, email } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

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
                  redirectURL: url,
                  qrCodeUrl: qrCodeUrl,
                  createdat: Date.now(),
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
  const { email } = req.body;

  try {
    const result = await UserModel.findOne({ email: email });

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter visitHistory to count matches
    const matches = result.visitHistory.filter(
      (entry) => entry.shortId === shortId
    );

    return res.json({
      totalClicks: matches.length,
      analytics: matches,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function deleteUrl(req, res) {
  const shortId = req.params.shortId;
  const { email } = req.body;

  try {
    const result = await UserModel.findOne({ email: email, shortId: shortId });

    if (!result) {
      return res
        .status(404)
        .json({ error: "User not found or ShortId not found" });
    }

    // Check if there's only one element in the shortId array
    if (result.shortId.length === 1) {
      // Instead of using $pull, directly remove the entire shortId field
      const updatedResult = await UserModel.updateOne(
        { email: email },
        {
          $unset: {
            shortId: "",
            redirectURL: "",
            qrCodeUrl: "",
            createdat: "",
          },
        }
      );

      return res
        .status(200)
        .json({ message: "URL and corresponding data deleted successfully" });
    } else {
      // If there are multiple elements, use $pull to remove the specific shortId
      const updateOperation = {
        $pull: {
          shortId: shortId,
          redirectURL: {
            $eq: result.redirectURL[result.shortId.indexOf(shortId)],
          },
          qrCodeUrl: { $eq: result.qrCodeUrl[result.shortId.indexOf(shortId)] },
          createdat: { $eq: result.createdat[result.shortId.indexOf(shortId)] },
        },
      };

      const updatedResult = await UserModel.updateMany(
        { email: email },
        updateOperation
      );

      return res.status(200).json({
        message: "URL and corresponding data deleted successfully",
        index: result.shortId.indexOf(shortId),
      });
    }
  } catch (error) {
    console.error("Error deleting URL and corresponding data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUrl(req, res) {
  const { email } = req.body;

  try {
    const existUrl = await UserModel.findOne({ email: email });

    if (!existUrl) {
      return res.status(404).json({ msg: "No documents found" });
    }

    const keysToExtract = [
      "shortId",
      "qrCodeUrl",
      "redirectURL",
      "createdat",
      "visitHistory",
    ];
    const extractedData = {};

    keysToExtract.forEach((key) => {
      if (existUrl[key] !== undefined) {
        const data = {};
        data[key] = existUrl[key];

        if (key === "visitHistory") {
          const visitHistory = existUrl.visitHistory || [];
          const shortIdCounts = {};
          existUrl.shortId.forEach((id) => {
            shortIdCounts[id] = 0;
          });
          visitHistory.forEach((entry) => {
            const shortId = entry.shortId;
            shortIdCounts[shortId] = (shortIdCounts[shortId] || 0) + 1;
          });
          data["shortIdCounts"] = shortIdCounts;
        } else if (key === "createdat") {
          // Format timestamps into an array of formatted timestamps
          const formattedCreatedAt = existUrl.createdat.map((timestamp) =>
            formatTime(timestamp)
          );
          data["formattedCreatedAt"] = formattedCreatedAt;
        }

        Object.assign(extractedData, data);
      }
    });

    // Check if the number of formattedCreatedAt values matches the number of createdat values
    const createdatLength = existUrl.createdat ? existUrl.createdat.length : 0;
    const formattedCreatedAtLength = extractedData.formattedCreatedAt
      ? extractedData.formattedCreatedAt.length
      : 0;
    if (createdatLength !== formattedCreatedAtLength) {
      console.error(
        "Mismatch between createdat and formattedCreatedAt lengths"
      );
      return res.status(500).json({ msg: "Internal Server Error" });
    }

    res.status(200).json(extractedData);
  } catch (error) {
    console.error("Retrieve operation failed!", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

function formatTime(timestamp) {
  const currentTime = Date.now();
  const difference = currentTime - timestamp;

  if (difference < 60000) {
    return "now";
  } else if (difference < 3600000) {
    const minutes = Math.floor(difference / 60000);
    return `${minutes}m ago`;
  } else if (difference < 86400000) {
    const hours = Math.floor(difference / 3600000);
    return `${hours}h ago`;
  } else {
    // Format the timestamp into a readable date string
    return new Date(timestamp).toLocaleString();
  }
}

async function redirect(req, res) {
  const shortId = req.params.shortId;

  try {
    const entry = await UserModel.findOneAndUpdate(
      { shortId: { $elemMatch: { $eq: shortId } } },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            shortId: shortId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    const index = entry.shortId.indexOf(shortId);
    if (index === -1) {
      return res.status(404).json({ error: "ShortId not found" });
    }

    const redirectURL = entry.redirectURL[index];
    if (!redirectURL) {
      return res.status(404).json({ error: "RedirectURL not found" });
    }

    // Redirect to the corresponding URL
    res.redirect(redirectURL);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  getAnalytics,
  getUrl,
  deleteUrl,
  redirect,
};

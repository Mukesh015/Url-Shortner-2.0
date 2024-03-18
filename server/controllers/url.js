const shortid = require("shortid");
const qr = require('qr-image');
const fs = require('fs');
const {URL} = require("../models/url");
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

    if (!body.url) return res.status(400).json({ error: "url is required" });

    const shortId = shortid();
    const qr_png = qr.imageSync(`http://localhost:8010/redirect/${shortId}`, { type: 'png' });

    cloudinary.uploader.upload_stream({
        resource_type: 'image',
        folder: 'qr_codes'
    }, async (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to upload QR code" });
        }

        const qrCodeUrl = result.secure_url;
        const newUrl = new URL({
            shortId: shortId,
            redirectURL: body.url,
            qrCodeUrl: qrCodeUrl,
        });

        try {
            await newUrl.save();
            return res.json({ id: shortId });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to generate short URL" });
        }
    }).end(qr_png);
}


async function getAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId: shortId });
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = { handleGenerateNewShortURL,getAnalytics };
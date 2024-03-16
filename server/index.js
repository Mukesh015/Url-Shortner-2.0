const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/url");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const URL = require("./models/url");

dotenv.config({ path: "../.env" });
const PORT = process.env.PORT;
const DB = process.env.db;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(DB)
  .then(console.log("Database connected"))
  .catch((error) => {
    console.error("Database connection failed", error);
  });
app.use("/", router);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});

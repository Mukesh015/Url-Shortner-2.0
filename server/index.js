const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/url");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { URL, UserModel } = require("./models/url");

dotenv.config({ path: "../.env" });
const app = express();
const PORT = process.env.PORT;
const DB = process.env.db;

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

app.get("/redirect/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await UserModel.findOneAndUpdate(
      {
        shortId: shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});

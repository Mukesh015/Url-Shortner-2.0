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


app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});
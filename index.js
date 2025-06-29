const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/auth");
const commitRoutes = require("./routes/commit");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/commit", commitRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("Gemmit backend running"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => console.log("Server started"));
  })
  .catch((err) => console.error("DB connection error:", err));

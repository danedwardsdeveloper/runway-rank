const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const itemsRouter = require("./entities/items/items.router.js");
const accountsRouter = require("./entities/accounts/accounts.router.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 },
    // Not secure for development, set maxAge for expiration
  })
);

const path = require("path");
const imagesDir = path.join(__dirname, "images");
app.use("/images", express.static(imagesDir));

app.use("/api", itemsRouter);
app.use("/api", accountsRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log("ERROR", error);
  res.json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

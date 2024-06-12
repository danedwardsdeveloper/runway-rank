const express = require("express");
const cors = require("cors");

const itemsRouter = require("./entities/items/items.router.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const path = require("path");
const imagesDir = path.join(__dirname, "images");
app.use("/images", express.static(imagesDir));

app.use("/api", itemsRouter);

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

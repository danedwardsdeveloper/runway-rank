const express = require("express");
const cors = require("cors");

const itemsRouter = require("./routes/itemsRouter.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api", itemsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

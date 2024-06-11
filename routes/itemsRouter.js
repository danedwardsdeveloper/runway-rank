const express = require("express");
const itemsRouter = express.Router();

const { getItems, getTopItems } = require("../models/items-model");

itemsRouter.get("/items", async (req, res) => {
  try {
    const items = await getItems();
    return res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items!" });
  }
});

itemsRouter.get("/top-rated", async (req, res) => {
  try {
    const items = await getTopItems();
    const topItems = items.rows;
    return res.json(topItems);
  } catch (error) {
    console.error("Error fetching top-rated items:", error);
    return res.status(500).json({ message: "Error getting top-rated items!" });
  }
});

module.exports = itemsRouter;

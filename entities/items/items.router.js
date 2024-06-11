const express = require("express");
const itemsRouter = express.Router();

const { getAllItems, getTotalItems, getTop10 } = require("./items.controller.js");
const { calculateWholePairs } = require("./utils.js");

itemsRouter.get("/items", getAllItems);
itemsRouter.get("/items/total", getTotalItems);
itemsRouter.get("/items/top-10", getTop10);

module.exports = itemsRouter;

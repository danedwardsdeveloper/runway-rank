const express = require("express");
const itemsRouter = express.Router();

const { getAllItems, getTotalPairs, getPairsRated, postRatings, getTop10 } = require("./items.controller.js");

itemsRouter.get("/items", getAllItems);
itemsRouter.get("/items/whole-pairs", getTotalPairs);
itemsRouter.get("/items/pairs-rated", getPairsRated);
itemsRouter.post("/items/post-ratings", postRatings);
itemsRouter.get("/items/top-10", getTop10);

module.exports = itemsRouter;

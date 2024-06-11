const express = require("express");
const itemsRouter = express.Router();

const { getAllItems, getTotalPairs, getPairsRated, postRatings, getNextPair, getTop10 } = require("./items.controller.js");

itemsRouter.get("/items", getAllItems);
itemsRouter.get("/items/whole-pairs", getTotalPairs);
itemsRouter.get("/items/pairs-rated", getPairsRated);
itemsRouter.get("/items/get-next-pair", getNextPair);
itemsRouter.get("/items/top-10", getTop10);

itemsRouter.post("/items/post-ratings", postRatings);

module.exports = itemsRouter;

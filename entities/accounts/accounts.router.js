const express = require("express");
const accountsRouter = express.Router();

const { createAccount } = require("./accounts.controller.js");

accountsRouter.post("/accounts/create-account", createAccount);

module.exports = accountsRouter;

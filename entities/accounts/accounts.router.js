const express = require("express");
const passport = require("passport");

const accountsRouter = express.Router();

const { createAccount, logIn, logOut } = require("./accounts.controller.js");

accountsRouter.post("/accounts/create-account", createAccount);
accountsRouter.post("/accounts/log-in", logIn);
accountsRouter.post("/accounts/log-out", logOut);

module.exports = accountsRouter;

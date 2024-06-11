// const express = require("express");
// const accountsRouter = express.Router();

// const passport = require("passport");

// const { checkUserExists } = require("../models/accounts");

// accountsRouter.post("/login", passport.authenticate("local", { session: false }), async (req, res) => {
//   try {
//     req.logIn(req.user, (err) => {
//       if (err) return res.status(500).json({ message: err.message });
//     return res.json({ message: "Login successful!", token });
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.status(500).json({ message: "Error logging in!" });
//   }
// });

// module.exports = accountsRouter;

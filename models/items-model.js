const pool = require("./database.js");

const getItems = () => pool.query("SELECT * FROM items");

const getTopItems = () => pool.query("SELECT * FROM items ORDER BY average_score DESC LIMIT 10");

module.exports = {
  getItems,
  getTopItems,
};

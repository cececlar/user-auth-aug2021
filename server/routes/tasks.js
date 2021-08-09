const router = require("express").Router();
const User = require("../models/user");
const Task = require("../models/task");

router.get("/current", (req, res) => {
  res.json("Here are your tasks.");
});

module.exports = router;

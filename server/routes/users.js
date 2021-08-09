const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("../models/task");
const authorize = require("../middleware/authorize");

//CREATE new user

router.post("/", (req, res) => {
  const { password } = req.body;
  new User({ ...req.body, password: password })
    .save()
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

//LOGIN user
router.post("/login", async (req, res) => {
  User.where({ email: req.body.email })
    .fetch()
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

//Get Current User
router.get("/current", (req, res) => {
  User.where({ id: 1 })
    .fetch()
    .then((user) => {
      const currentUser = { ...user.attributes, password: null };
      Task.where({ user_id: currentUser.id })
        .fetchAll()
        .then((tasks) => {
          res.status(200).json({ currentUser, tasks });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;

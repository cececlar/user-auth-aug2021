const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("../models/task");
const authorize = require("../middleware/authorize");

//CREATE new user
//TODO: Update this so that when a new user is created, their password is encrypted before it is stored on the database. Then, generate a JSON web token and send it with the response.
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
//TODO: Verify that the user has entered the password associated with their account. Then, generate a JSON web token and send it with the response.
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
//TODO: Write a middleware function in server/middleware/authorize.js to verify that a user has sent their JSON web token in the authorization headers of their request, and that it is valid. Invoke the middleware function.
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

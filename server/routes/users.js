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

  bcrypt.hash(password, 8).then((hashedPassword) => {
    new User({ ...req.body, password: hashedPassword })
      .save()
      .then((user) => {
        const token = jwt.sign(
          { id: user.id, email: user.attributes.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.status(201).json({ user, token });
      })
      .catch((err) => {
        res.status(400).send({ error: err.message });
      });
  });
});

//LOGIN user
//TODO: Verify that the user has entered the password associated with their account. Then, generate a JSON web token and send it with the response.
router.post("/login", (req, res) => {
  User.where({ email: req.body.email })
    .fetch()
    .then((user) => {
      const isMatch = bcrypt.compareSync(
        req.body.password,
        user.attributes.password
      );
      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials." });
      }
      const token = jwt.sign(
        { id: user.id, email: user.attributes.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(201).json({ user, token });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

//Get Current User
//TODO: Write a middleware function in server/middleware/authorize.js to verify that a user has sent their JSON web token in the authorization headers of their request, and that it is valid. Invoke the middleware function.
router.get("/current", authorize, (req, res) => {
  console.log(req.decoded);
  User.where({ id: req.decoded.id })
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

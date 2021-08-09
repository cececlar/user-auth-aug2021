const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("../models/task");
const authorize = require("../middleware/authorize");

//CREATE new user

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
router.post("/login", async (req, res) => {
  User.where({ email: req.body.email })
    .fetch()
    .then((user) => {
      const isMatch = bcrypt.compareSync(
        req.body.password,
        user.attributes.password
      );

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
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
router.get("/current", authorize, (req, res) => {
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

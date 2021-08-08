const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//CREATE new user
router.post('/', async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 8);
  if (password) {
    const user = await new User({
      ...req.body,
      password
    }).save();
    const token = jwt.sign(
      { id: user.id, email: user.attributes.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.status(201).json({ user, token });
  }
  return res.status(400).json({ message: 'Please enter required information' });
});

//LOGIN user
router.post('/login', async (req, res) => {
  const user = await User.where({ email: req.body.email }).fetch();
  const isMatch = await bcrypt.compare(
    req.body.password,
    user.attributes.password
  );
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });
  const token = jwt.sign(
    { id: user.id, email: user.attributes.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.status(201).json({ user, token });
});

//Get Current User
router.get('/current', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.where({ email: decoded.email }).fetch();
    const current = { ...user.attributes, password: null };
    return res.status(200).json(current);
  }
  return res.status(403).json({ message: 'Please login' });
});
module.exports = router;

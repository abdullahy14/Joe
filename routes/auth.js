const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { userId = 'demo-user', role = 'player', skillLevel = 'beginner' } = req.body;
  const token = jwt.sign(
    {
      sub: userId,
      role,
      skillLevel
    },
    process.env.JWT_SECRET || 'core-concept-dev-secret',
    { expiresIn: '7d' }
  );

  res.json({ token });
});

module.exports = router;

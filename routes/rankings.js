const express = require('express');

const router = express.Router();

router.get('/:game', (req, res) => {
  const { game } = req.params;
  res.json({
    game,
    leaders: [
      { rank: 1, handle: 'NovaClutch', rating: 2875 },
      { rank: 2, handle: 'CoreViper', rating: 2822 },
      { rank: 3, handle: 'PulseKing', rating: 2790 }
    ],
    supportPlayer: req.supportPlayer
  });
});

module.exports = router;

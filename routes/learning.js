const express = require('express');

const router = express.Router();

const badgeCatalog = {
  beginner: 'Rookie Fragger',
  intermediate: 'Clutch Specialist',
  advanced: 'Strategist',
  pro: 'MVP Legend'
};

router.get('/:game/:level', (req, res) => {
  const { game, level } = req.params;
  const normalizedLevel = level.toLowerCase();

  res.json({
    route: `/learn/${game}/${level}`,
    curriculum: {
      game,
      level: normalizedLevel,
      progress: 62,
      badgeOnCompletion: badgeCatalog[normalizedLevel] || 'Core Graduate'
    },
    supportPlayer: req.supportPlayer
  });
});

router.get('/coaching', (req, res) => {
  res.json({
    sessions: [
      { coach: 'AstraCoach', game: 'Valorant', rating: 4.9, hourlyRate: 35 },
      { coach: 'NebulaAim', game: 'CS2', rating: 4.8, hourlyRate: 30 }
    ]
  });
});

module.exports = router;

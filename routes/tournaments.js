const express = require('express');

const router = express.Router();

function reportMiddleware(req, res, next) {
  const { reportReason } = req.body;
  req.reportContext = {
    submitted: Boolean(reportReason),
    moderationPriority: reportReason ? 'high' : 'normal'
  };
  next();
}

function generateBracket(participants = [], format = 'single_elimination') {
  const rounds = [];
  let currentRound = [...participants];

  while (currentRound.length > 1) {
    const nextRound = [];
    const matches = [];

    for (let i = 0; i < currentRound.length; i += 2) {
      const teamA = currentRound[i];
      const teamB = currentRound[i + 1] || 'BYE';
      matches.push({ teamA, teamB, winner: null });
      nextRound.push(`Winner ${teamA} vs ${teamB}`);
    }

    rounds.push(matches);
    currentRound = nextRound;
  }

  return {
    format,
    rounds,
    hasLowerBracket: format === 'double_elimination'
  };
}

router.get('/', (req, res) => {
  const { game = 'valorant', stakes = 'low', entry = 'free' } = req.query;

  res.json({
    game,
    stakes,
    entry,
    tournaments: [
      { id: 't1', title: 'Night Ops Cup', prizePool: 500, status: 'live' },
      { id: 't2', title: 'Rookie Rumble', prizePool: 150, status: 'upcoming' }
    ],
    supportPlayer: req.supportPlayer
  });
});

router.post('/bracket', (req, res) => {
  const { participants = [], format = 'single_elimination' } = req.body;
  res.json({ bracket: generateBracket(participants, format) });
});

router.get('/quick-join', (req, res) => {
  res.json({ message: 'Matching you with teams based on role and skill.' });
});

router.get('/analyze', (req, res) => {
  res.json({ message: 'Opponent tendencies analyzed. Prioritize post-plant utility.' });
});

router.post('/report', reportMiddleware, (req, res) => {
  res.json({ report: req.reportContext });
});

module.exports = router;

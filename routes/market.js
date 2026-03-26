const express = require('express');

const router = express.Router();

function fraudDetectionMiddleware(req, res, next) {
  const { currentPrice = 0, averagePrice = 0 } = req.body;
  const suspiciousSpike = averagePrice > 0 && currentPrice >= averagePrice * 2.5;

  req.fraudCheck = {
    suspiciousSpike,
    reasons: suspiciousSpike ? ['Unusual market spike detected'] : []
  };
  next();
}

router.get('/products', (req, res) => {
  const { character, game = 'valorant' } = req.query;

  res.json({
    game,
    featured: [
      { id: 'p1', title: 'Immortal Ready Account', price: 115, category: 'account' },
      { id: 'p2', title: 'Radiant Skin Bundle', price: 49, category: 'item' }
    ],
    filteredForCharacter: character || null,
    supportPlayer: req.supportPlayer
  });
});

router.post('/transactions/check', fraudDetectionMiddleware, (req, res) => {
  res.json({
    flagged: req.fraudCheck.suspiciousSpike,
    reasons: req.fraudCheck.reasons,
    supportPlayer: req.supportPlayer
  });
});

router.post('/wallet/topup', (req, res) => {
  const { amount = 0 } = req.body;
  res.json({ message: `Wallet top-up initialized for $${amount}` });
});

module.exports = router;

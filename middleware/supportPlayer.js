const DEFAULT_ACTIONS = {
  home: [
    { label: 'Start Your Pro Journey', href: '/learn/valorant/beginner', type: 'learn' },
    { label: 'Browse Live Tournaments', href: '/api/tournaments', type: 'compete' }
  ],
  learning: [
    { label: 'Book Coaching Session', href: '/api/learning/coaching', type: 'coach' },
    { label: 'Find Low-Stakes Tournament', href: '/api/tournaments?stakes=low', type: 'compete' }
  ],
  marketplace: [
    { label: 'Top-up Wallet', href: '/api/market/wallet/topup', type: 'wallet' },
    { label: 'View Character Bundles', href: '/api/market/products?tag=bundle', type: 'shop' }
  ],
  tournaments: [
    { label: 'Quick-Join Team', href: '/api/tournaments/quick-join', type: 'compete' },
    { label: 'Analyze Opponents', href: '/api/tournaments/analyze', type: 'intel' }
  ]
};

class SupportPlayerEngine {
  constructor(options = {}) {
    this.lowBalanceThreshold = options.lowBalanceThreshold ?? 25;
    this.highSkillLevels = new Set(['advanced', 'pro']);
  }

  determinePageKey(context = {}) {
    const path = (context.path || '').toLowerCase();

    if (path.includes('/learn')) return 'learning';
    if (path.includes('/market')) return 'marketplace';
    if (path.includes('/tournament') || path.includes('/rankings')) return 'tournaments';
    return 'home';
  }

  recommend({ user = {}, context = {} }) {
    const pageKey = this.determinePageKey(context);
    const skillLevel = (user.skillLevel || 'beginner').toLowerCase();
    const walletBalance = Number(user.walletBalance || 0);
    const recentGames = user.recentlyViewedGames || [];
    const preferredCharacter = user.mostPlayedCharacter;
    const currentGame = context.game || recentGames[0] || 'valorant';

    const actions = [...(DEFAULT_ACTIONS[pageKey] || DEFAULT_ACTIONS.home)];

    if (pageKey === 'learning') {
      actions.unshift({
        label: `Apply ${currentGame} Skills in Low-Stakes Cup`,
        href: `/api/tournaments?game=${encodeURIComponent(currentGame)}&stakes=low`,
        type: 'bridge'
      });

      if (this.highSkillLevels.has(skillLevel)) {
        actions.unshift({
          label: 'Enter Advanced Scrims',
          href: `/api/tournaments?game=${encodeURIComponent(currentGame)}&tier=advanced`,
          type: 'elite'
        });
      }
    }

    if (pageKey === 'marketplace' && preferredCharacter) {
      actions.unshift({
        label: `Gear for ${preferredCharacter}`,
        href: `/api/market/products?character=${encodeURIComponent(preferredCharacter)}`,
        type: 'shop'
      });
    }

    if (walletBalance < this.lowBalanceThreshold) {
      actions.push({
        label: 'Low Balance: Join Free Entry Match',
        href: `/api/tournaments?game=${encodeURIComponent(currentGame)}&entry=free`,
        type: 'budget'
      });
    } else {
      actions.push({
        label: 'Enter Prize Pool Tournament',
        href: `/api/tournaments?game=${encodeURIComponent(currentGame)}&entry=premium`,
        type: 'prize'
      });
    }

    return {
      pageKey,
      insight: `Optimized for ${skillLevel} ${currentGame} player`,
      nextActions: actions.slice(0, 4)
    };
  }
}

const supportPlayerEngine = new SupportPlayerEngine();

function supportPlayerMiddleware(req, res, next) {
  req.supportPlayer = supportPlayerEngine.recommend({
    user: req.user || {
      skillLevel: req.headers['x-skill-level'] || 'beginner',
      walletBalance: Number(req.headers['x-wallet-balance'] || 0),
      recentlyViewedGames: (req.headers['x-recent-games'] || 'valorant').split(','),
      mostPlayedCharacter: req.headers['x-most-played-character'] || 'Jett'
    },
    context: {
      path: req.originalUrl,
      game: req.params.game || req.query.game
    }
  });

  res.locals.supportPlayer = req.supportPlayer;
  next();
}

module.exports = {
  SupportPlayerEngine,
  supportPlayerEngine,
  supportPlayerMiddleware
};

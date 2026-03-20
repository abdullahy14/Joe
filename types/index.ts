export type EntityTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type BaseEntity = {
  id: string;
  name: string;
} & EntityTimestamps;

export type User = BaseEntity & {
  role: 'manager' | 'player' | 'client' | 'commentator';
  email: string;
};

export type Sponsor = BaseEntity & {
  budget: number;
  industry: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
};

export type Player = BaseEntity & {
  gamerTag: string;
  role: string;
  rank: string;
  teamId?: string;
};

export type Team = BaseEntity & {
  game: string;
  region: string;
  playerIds: string[];
  sponsorId?: string;
  clientId?: string;
  status: 'active' | 'bootcamp' | 'scouting';
};

export type Tournament = BaseEntity & {
  title: string;
  game: string;
  status: 'draft' | 'registration' | 'live' | 'completed';
  prizePool: number;
  teamIds: string[];
  fixtureMatchIds: string[];
  startsAt: string;
};

export type Match = BaseEntity & {
  title: string;
  tournamentId?: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
};

export type MarketplaceItem = BaseEntity & {
  title: string;
  category: 'account' | 'coaching' | 'item';
  price: number;
  description: string;
  seller: string;
};

export type Comment = BaseEntity & {
  title: string;
  entityType: 'match' | 'tournament';
  entityId: string;
  author: string;
  message: string;
};

export type Client = BaseEntity & {
  title: string;
  company: string;
  requestedGame: string;
  budget: number;
  status: 'lead' | 'proposal' | 'converted';
};

export type Commentator = BaseEntity & {
  title: string;
  specialty: string;
  experience: number;
};

export type GamerJob = BaseEntity & {
  title: string;
  reward: number;
  completed: boolean;
};

export type CartItem = {
  id: string;
  marketplaceItemId: string;
  quantity: number;
};

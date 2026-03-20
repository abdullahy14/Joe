export type EntityBase = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type User = EntityBase & {
  name: string;
  role: 'manager' | 'coach' | 'client' | 'commentator';
  region: string;
};

export type Sponsor = EntityBase & {
  name: string;
  tier: string;
  budget: number;
  focus: string;
};

export type Player = EntityBase & {
  name: string;
  alias: string;
  role: string;
  rank: string;
  teamId?: string;
  status: 'active' | 'benched' | 'free-agent';
};

export type Team = EntityBase & {
  name: string;
  game: string;
  region: string;
  sponsorId?: string;
  playerIds: string[];
  status: 'active' | 'trial' | 'archived';
};

export type Match = EntityBase & {
  title: string;
  tournamentId?: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
};

export type Tournament = EntityBase & {
  title: string;
  game: string;
  format: string;
  prizePool: number;
  status: 'draft' | 'open' | 'completed';
  teamIds: string[];
  matchIds: string[];
};

export type MarketplaceCategory = 'accounts' | 'coaching' | 'items';

export type MarketplaceItem = EntityBase & {
  title: string;
  name: string;
  category: MarketplaceCategory;
  price: number;
  stock: number;
  description: string;
};

export type Comment = EntityBase & {
  name: string;
  entityType: 'match' | 'tournament' | 'commentator';
  entityId: string;
  author: string;
  message: string;
};

export type CartItem = {
  marketplaceItemId: string;
  quantity: number;
};

export type GamerJob = EntityBase & {
  title: string;
  reward: number;
  status: 'open' | 'completed';
};

export type Commentator = EntityBase & {
  name: string;
  specialty: string;
  style: string;
};

export type Client = EntityBase & {
  name: string;
  game: string;
  region: string;
  status: 'lead' | 'converted';
};

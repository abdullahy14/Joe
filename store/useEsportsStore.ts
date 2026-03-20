'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import usersData from '@/data/users.json';
import teamsData from '@/data/teams.json';
import playersData from '@/data/players.json';
import tournamentsData from '@/data/tournaments.json';
import matchesData from '@/data/matches.json';
import marketplaceData from '@/data/marketplace.json';
import sponsorsData from '@/data/sponsors.json';
import commentsData from '@/data/comments.json';
import type {
  CartItem,
  Client,
  Comment,
  Commentator,
  GamerJob,
  MarketplaceItem,
  Match,
  Player,
  Sponsor,
  Team,
  Tournament,
  User,
} from '@/types';
import { makeId, stampNow } from '@/lib/utils';

type Draft<T> = Partial<T> & Pick<T, 'name'>;

type Store = {
  users: User[];
  teams: Team[];
  players: Player[];
  tournaments: Tournament[];
  matches: Match[];
  marketplace: MarketplaceItem[];
  sponsors: Sponsor[];
  comments: Comment[];
  cart: CartItem[];
  clients: Client[];
  commentators: Commentator[];
  gamerJobs: GamerJob[];
  createEntity: <T extends { id: string; createdAt: string; updatedAt: string }>(
    key: StoreEntityKey,
    entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  updateEntity: <T extends { id: string; updatedAt: string }>(key: StoreEntityKey, id: string, patch: Partial<T>) => void;
  deleteEntity: (key: StoreEntityKey, id: string) => void;
  addToCart: (marketplaceItemId: string) => void;
  removeFromCart: (marketplaceItemId: string) => void;
  clearCart: () => void;
  fakeCheckout: () => void;
  convertClientToTeam: (clientId: string) => void;
  generateFixtures: (tournamentId: string) => void;
  toggleJobCompletion: (jobId: string) => void;
};

type StoreEntityKey =
  | 'teams'
  | 'players'
  | 'tournaments'
  | 'matches'
  | 'marketplace'
  | 'sponsors'
  | 'comments'
  | 'clients'
  | 'commentators'
  | 'gamerJobs';

const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'Vertex Brands',
    title: 'Merchandising Prospect',
    company: 'Vertex Brands',
    requestedGame: 'Valorant',
    budget: 20000,
    status: 'proposal',
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z',
  },
  {
    id: 'client-2',
    name: 'Atlas Events',
    title: 'LAN Activation Lead',
    company: 'Atlas Events',
    requestedGame: 'Rocket League',
    budget: 12000,
    status: 'lead',
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-04T10:00:00.000Z',
  },
];

const initialCommentators: Commentator[] = [
  {
    id: 'commentator-1',
    name: 'Mika Park',
    title: 'Play-by-Play',
    specialty: 'Valorant',
    experience: 5,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'commentator-2',
    name: 'Ezra Cole',
    title: 'Color Analyst',
    specialty: 'Overwatch 2',
    experience: 3,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z',
  },
];

const initialJobs: GamerJob[] = [
  {
    id: 'job-1',
    name: 'Clip package',
    title: 'Create 10 short-form highlight clips',
    reward: 180,
    completed: true,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'job-2',
    name: 'Scrim review',
    title: 'Review scrim VOD and tag mistakes',
    reward: 90,
    completed: false,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
];

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

export const useEsportsStore = create<Store>()(
  persist(
    (set, get) => ({
      users: usersData as User[],
      teams: teamsData as Team[],
      players: playersData as Player[],
      tournaments: tournamentsData as Tournament[],
      matches: matchesData as Match[],
      marketplace: marketplaceData as MarketplaceItem[],
      sponsors: sponsorsData as Sponsor[],
      comments: commentsData as Comment[],
      cart: [],
      clients: initialClients,
      commentators: initialCommentators,
      gamerJobs: initialJobs,
      createEntity: (key, entity) =>
        set((state) => {
          const collection = state[key] as Array<Record<string, unknown>>;
          const now = stampNow();
          const prefix = key.slice(0, -1);
          return {
            [key]: [
              ...collection,
              {
                ...entity,
                id: makeId(prefix),
                createdAt: now,
                updatedAt: now,
              },
            ],
          } as Partial<Store>;
        }),
      updateEntity: (key, id, patch) =>
        set((state) => ({
          [key]: (state[key] as Array<{ id: string; updatedAt: string }>).map((item) =>
            item.id === id ? { ...item, ...patch, updatedAt: stampNow() } : item,
          ),
        } as Partial<Store>)),
      deleteEntity: (key, id) =>
        set((state) => ({
          [key]: (state[key] as Array<{ id: string }>).filter((item) => item.id !== id),
        } as Partial<Store>)),
      addToCart: (marketplaceItemId) =>
        set((state) => {
          const existing = state.cart.find((item) => item.marketplaceItemId === marketplaceItemId);
          return {
            cart: existing
              ? state.cart.map((item) =>
                  item.marketplaceItemId === marketplaceItemId ? { ...item, quantity: item.quantity + 1 } : item,
                )
              : [...state.cart, { id: makeId('cart'), marketplaceItemId, quantity: 1 }],
          };
        }),
      removeFromCart: (marketplaceItemId) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.marketplaceItemId === marketplaceItemId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ cart: [] }),
      fakeCheckout: () => set({ cart: [] }),
      convertClientToTeam: (clientId) =>
        set((state) => {
          const client = state.clients.find((entry) => entry.id === clientId);
          if (!client) return state;
          const now = stampNow();
          return {
            clients: state.clients.map((entry) =>
              entry.id === clientId ? { ...entry, status: 'converted', updatedAt: now } : entry,
            ),
            teams: [
              ...state.teams,
              {
                id: makeId('team'),
                name: `${client.company} Squad`,
                game: client.requestedGame,
                region: 'NA',
                playerIds: [],
                clientId: client.id,
                status: 'scouting',
                createdAt: now,
                updatedAt: now,
              },
            ],
          };
        }),
      generateFixtures: (tournamentId) =>
        set((state) => {
          const tournament = state.tournaments.find((entry) => entry.id === tournamentId);
          if (!tournament || tournament.teamIds.length < 2) return state;
          const newMatches: Match[] = [];
          for (let index = 0; index < tournament.teamIds.length; index += 2) {
            const homeTeamId = tournament.teamIds[index];
            const awayTeamId = tournament.teamIds[index + 1];
            if (!homeTeamId || !awayTeamId) continue;
            const matchId = makeId('match');
            const homeTeam = state.teams.find((team) => team.id === homeTeamId)?.name ?? 'TBD';
            const awayTeam = state.teams.find((team) => team.id === awayTeamId)?.name ?? 'TBD';
            newMatches.push({
              id: matchId,
              name: `${homeTeam} vs ${awayTeam}`,
              title: `${tournament.title} Fixture ${newMatches.length + 1}`,
              tournamentId,
              homeTeamId,
              awayTeamId,
              scheduledAt: tournament.startsAt,
              homeScore: 0,
              awayScore: 0,
              status: 'scheduled',
              createdAt: stampNow(),
              updatedAt: stampNow(),
            });
          }
          return {
            matches: [...state.matches, ...newMatches],
            tournaments: state.tournaments.map((entry) =>
              entry.id === tournamentId
                ? { ...entry, fixtureMatchIds: [...entry.fixtureMatchIds, ...newMatches.map((match) => match.id)], updatedAt: stampNow() }
                : entry,
            ),
          };
        }),
      toggleJobCompletion: (jobId) =>
        set((state) => ({
          gamerJobs: state.gamerJobs.map((job) =>
            job.id === jobId ? { ...job, completed: !job.completed, updatedAt: stampNow() } : job,
          ),
        })),
    }),
    {
      name: 'offline-esports-platform',
      storage,
      partialize: (state) => ({
        teams: state.teams,
        players: state.players,
        tournaments: state.tournaments,
        matches: state.matches,
        marketplace: state.marketplace,
        sponsors: state.sponsors,
        comments: state.comments,
        cart: state.cart,
        clients: state.clients,
        commentators: state.commentators,
        gamerJobs: state.gamerJobs,
      }),
    },
  ),
);

export const selectTotals = (state: Store) => ({
  earnings: state.gamerJobs.filter((job) => job.completed).reduce((sum, job) => sum + job.reward, 0),
  completedJobs: state.gamerJobs.filter((job) => job.completed).length,
  cartCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
});

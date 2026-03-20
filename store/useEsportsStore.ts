'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import usersSeed from '@/data/users.json';
import teamsSeed from '@/data/teams.json';
import playersSeed from '@/data/players.json';
import tournamentsSeed from '@/data/tournaments.json';
import matchesSeed from '@/data/matches.json';
import marketplaceSeed from '@/data/marketplace.json';
import sponsorsSeed from '@/data/sponsors.json';
import commentsSeed from '@/data/comments.json';
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

const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

type StoreState = {
  users: User[];
  teams: Team[];
  players: Player[];
  tournaments: Tournament[];
  matches: Match[];
  marketplace: MarketplaceItem[];
  sponsors: Sponsor[];
  comments: Comment[];
  cart: CartItem[];
  gamerJobs: GamerJob[];
  commentators: Commentator[];
  clients: Client[];
  createTeam: (payload: CreateInput<Team>) => void;
  updateTeam: (id: string, payload: UpdateInput<Team>) => void;
  deleteTeam: (id: string) => void;
  createPlayer: (payload: CreateInput<Player>) => void;
  updatePlayer: (id: string, payload: UpdateInput<Player>) => void;
  deletePlayer: (id: string) => void;
  createTournament: (payload: CreateInput<Tournament>) => void;
  updateTournament: (id: string, payload: UpdateInput<Tournament>) => void;
  deleteTournament: (id: string) => void;
  generateFixtures: (tournamentId: string) => void;
  createMatch: (payload: CreateInput<Match>) => void;
  updateMatch: (id: string, payload: UpdateInput<Match>) => void;
  deleteMatch: (id: string) => void;
  createMarketplaceItem: (payload: CreateInput<MarketplaceItem>) => void;
  updateMarketplaceItem: (id: string, payload: UpdateInput<MarketplaceItem>) => void;
  deleteMarketplaceItem: (id: string) => void;
  createSponsor: (payload: CreateInput<Sponsor>) => void;
  updateSponsor: (id: string, payload: UpdateInput<Sponsor>) => void;
  deleteSponsor: (id: string) => void;
  createComment: (payload: CreateInput<Comment>) => void;
  deleteComment: (id: string) => void;
  addToCart: (marketplaceItemId: string) => void;
  removeFromCart: (marketplaceItemId: string) => void;
  checkout: () => void;
  createGamerJob: (payload: CreateInput<GamerJob>) => void;
  updateGamerJob: (id: string, payload: UpdateInput<GamerJob>) => void;
  deleteGamerJob: (id: string) => void;
  createCommentator: (payload: CreateInput<Commentator>) => void;
  deleteCommentator: (id: string) => void;
  createClient: (payload: CreateInput<Client>) => void;
  deleteClient: (id: string) => void;
  convertClientToTeam: (clientId: string) => void;
};

const commentatorSeed: Commentator[] = [
  {
    id: 'commentator-1',
    name: 'Caster Flux',
    specialty: 'Valorant',
    style: 'Hype play-by-play',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  },
];

const gamerJobSeed: GamerJob[] = [
  {
    id: 'job-1',
    title: 'Review challenger scrim pack',
    reward: 120,
    status: 'completed',
    createdAt: '2026-01-20T10:10:00.000Z',
    updatedAt: '2026-01-20T10:10:00.000Z',
  },
  {
    id: 'job-2',
    title: 'Run stat overlay prep for weekend cup',
    reward: 95,
    status: 'open',
    createdAt: '2026-01-20T10:20:00.000Z',
    updatedAt: '2026-01-20T10:20:00.000Z',
  },
];

const clientSeed: Client[] = [
  {
    id: 'client-1',
    name: 'Solaris Academy',
    game: 'Valorant',
    region: 'NA',
    status: 'lead',
    createdAt: '2026-01-20T10:30:00.000Z',
    updatedAt: '2026-01-20T10:30:00.000Z',
  },
];

function addEntity<T extends { id: string; createdAt: string; updatedAt: string }>(
  list: T[],
  prefix: string,
  payload: CreateInput<T>,
): T[] {
  return [...list, { ...payload, id: uid(prefix), createdAt: now(), updatedAt: now() } as T];
}

function updateEntity<T extends { id: string; updatedAt: string }>(list: T[], id: string, payload: UpdateInput<T>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...payload, updatedAt: now() } : item));
}

export const useEsportsStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: usersSeed as User[],
      teams: teamsSeed as Team[],
      players: playersSeed as Player[],
      tournaments: tournamentsSeed as Tournament[],
      matches: matchesSeed as Match[],
      marketplace: marketplaceSeed as MarketplaceItem[],
      sponsors: sponsorsSeed as Sponsor[],
      comments: commentsSeed as Comment[],
      cart: [],
      gamerJobs: gamerJobSeed,
      commentators: commentatorSeed,
      clients: clientSeed,
      createTeam: (payload) => set((state) => ({ teams: addEntity(state.teams, 'team', payload) })),
      updateTeam: (id, payload) =>
        set((state) => {
          const nextPlayerIds = Array.isArray(payload.playerIds) ? payload.playerIds : undefined;
          return {
            teams: updateEntity(state.teams, id, payload),
            players: nextPlayerIds
              ? state.players.map((player) => ({
                  ...player,
                  teamId: nextPlayerIds.includes(player.id) ? id : player.teamId === id ? undefined : player.teamId,
                  updatedAt: nextPlayerIds.includes(player.id) || player.teamId === id ? now() : player.updatedAt,
                }))
              : state.players,
          };
        }),
      deleteTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
          players: state.players.map((player) => (player.teamId === id ? { ...player, teamId: undefined, updatedAt: now() } : player)),
          matches: state.matches.filter((match) => match.homeTeamId !== id && match.awayTeamId !== id),
          tournaments: state.tournaments.map((tournament) => ({
            ...tournament,
            teamIds: tournament.teamIds.filter((teamId) => teamId !== id),
            updatedAt: now(),
          })),
        })),
      createPlayer: (payload) =>
        set((state) => {
          const nextPlayers = addEntity(state.players, 'player', payload);
          const created = nextPlayers[nextPlayers.length - 1];
          return {
            players: nextPlayers,
            teams: created.teamId
              ? state.teams.map((team) =>
                  team.id === created.teamId ? { ...team, playerIds: [...new Set([...team.playerIds, created.id])], updatedAt: now() } : team,
                )
              : state.teams,
          };
        }),
      updatePlayer: (id, payload) =>
        set((state) => {
          const current = state.players.find((player) => player.id === id);
          const nextTeamId = payload.teamId === '' ? undefined : payload.teamId;
          return {
            players: updateEntity(state.players, id, { ...payload, teamId: nextTeamId }),
            teams: state.teams.map((team) => {
              const shouldRemove = current?.teamId === team.id && nextTeamId !== team.id;
              const shouldAdd = nextTeamId === team.id;
              if (!shouldRemove && !shouldAdd) return team;
              return {
                ...team,
                playerIds: shouldAdd ? [...new Set([...team.playerIds, id])] : team.playerIds.filter((playerId) => playerId !== id),
                updatedAt: now(),
              };
            }),
          };
        }),
      deletePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((player) => player.id !== id),
          teams: state.teams.map((team) => ({ ...team, playerIds: team.playerIds.filter((playerId) => playerId !== id), updatedAt: now() })),
        })),
      createTournament: (payload) => set((state) => ({ tournaments: addEntity(state.tournaments, 'tournament', payload) })),
      updateTournament: (id, payload) => set((state) => ({ tournaments: updateEntity(state.tournaments, id, payload) })),
      deleteTournament: (id) =>
        set((state) => ({
          tournaments: state.tournaments.filter((tournament) => tournament.id !== id),
          matches: state.matches.filter((match) => match.tournamentId !== id),
          comments: state.comments.filter((comment) => !(comment.entityType === 'tournament' && comment.entityId === id)),
        })),
      generateFixtures: (tournamentId) => {
        const state = get();
        const tournament = state.tournaments.find((entry) => entry.id === tournamentId);
        if (!tournament || tournament.teamIds.length < 2) return;
        const newMatches: Match[] = [];
        for (let i = 0; i < tournament.teamIds.length - 1; i += 1) {
          const homeTeamId = tournament.teamIds[i];
          const awayTeamId = tournament.teamIds[i + 1];
          newMatches.push({
            id: uid('match'),
            title: `${tournament.title} Fixture ${i + 1}`,
            tournamentId,
            homeTeamId,
            awayTeamId,
            scheduledAt: new Date(Date.now() + i * 86400000).toISOString(),
            homeScore: 0,
            awayScore: 0,
            status: 'scheduled',
            createdAt: now(),
            updatedAt: now(),
          });
        }
        set({
          matches: [...state.matches, ...newMatches],
          tournaments: state.tournaments.map((entry) =>
            entry.id === tournamentId
              ? { ...entry, matchIds: [...entry.matchIds, ...newMatches.map((match) => match.id)], updatedAt: now() }
              : entry,
          ),
        });
      },
      createMatch: (payload) =>
        set((state) => {
          const nextMatches = addEntity(state.matches, 'match', payload);
          const created = nextMatches[nextMatches.length - 1];
          return {
            matches: nextMatches,
            tournaments: created.tournamentId
              ? state.tournaments.map((tournament) =>
                  tournament.id === created.tournamentId
                    ? { ...tournament, matchIds: [...new Set([...tournament.matchIds, created.id])], updatedAt: now() }
                    : tournament,
                )
              : state.tournaments,
          };
        }),
      updateMatch: (id, payload) => set((state) => ({ matches: updateEntity(state.matches, id, payload) })),
      deleteMatch: (id) =>
        set((state) => ({
          matches: state.matches.filter((match) => match.id !== id),
          tournaments: state.tournaments.map((tournament) => ({
            ...tournament,
            matchIds: tournament.matchIds.filter((matchId) => matchId !== id),
            updatedAt: now(),
          })),
          comments: state.comments.filter((comment) => !(comment.entityType === 'match' && comment.entityId === id)),
        })),
      createMarketplaceItem: (payload) => set((state) => ({ marketplace: addEntity(state.marketplace, 'market', payload) })),
      updateMarketplaceItem: (id, payload) => set((state) => ({ marketplace: updateEntity(state.marketplace, id, payload) })),
      deleteMarketplaceItem: (id) =>
        set((state) => ({
          marketplace: state.marketplace.filter((item) => item.id !== id),
          cart: state.cart.filter((item) => item.marketplaceItemId !== id),
        })),
      createSponsor: (payload) => set((state) => ({ sponsors: addEntity(state.sponsors, 'sponsor', payload) })),
      updateSponsor: (id, payload) => set((state) => ({ sponsors: updateEntity(state.sponsors, id, payload) })),
      deleteSponsor: (id) =>
        set((state) => ({
          sponsors: state.sponsors.filter((sponsor) => sponsor.id !== id),
          teams: state.teams.map((team) => (team.sponsorId === id ? { ...team, sponsorId: undefined, updatedAt: now() } : team)),
        })),
      createComment: (payload) => set((state) => ({ comments: addEntity(state.comments, 'comment', payload) })),
      deleteComment: (id) => set((state) => ({ comments: state.comments.filter((comment) => comment.id !== id) })),
      addToCart: (marketplaceItemId) =>
        set((state) => {
          const existing = state.cart.find((item) => item.marketplaceItemId === marketplaceItemId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.marketplaceItemId === marketplaceItemId ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }
          return { cart: [...state.cart, { marketplaceItemId, quantity: 1 }] };
        }),
      removeFromCart: (marketplaceItemId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.marketplaceItemId !== marketplaceItemId) })),
      checkout: () => set({ cart: [] }),
      createGamerJob: (payload) => set((state) => ({ gamerJobs: addEntity(state.gamerJobs, 'job', payload) })),
      updateGamerJob: (id, payload) => set((state) => ({ gamerJobs: updateEntity(state.gamerJobs, id, payload) })),
      deleteGamerJob: (id) => set((state) => ({ gamerJobs: state.gamerJobs.filter((job) => job.id !== id) })),
      createCommentator: (payload) => set((state) => ({ commentators: addEntity(state.commentators, 'commentator', payload) })),
      deleteCommentator: (id) =>
        set((state) => ({
          commentators: state.commentators.filter((commentator) => commentator.id !== id),
          comments: state.comments.filter((comment) => !(comment.entityType === 'commentator' && comment.entityId === id)),
        })),
      createClient: (payload) => set((state) => ({ clients: addEntity(state.clients, 'client', payload) })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter((client) => client.id !== id) })),
      convertClientToTeam: (clientId) => {
        const state = get();
        const client = state.clients.find((entry) => entry.id === clientId);
        if (!client) return;
        set({
          teams: addEntity(state.teams, 'team', {
            name: `${client.name} Team`,
            game: client.game,
            region: client.region,
            sponsorId: undefined,
            playerIds: [],
            status: 'trial',
          }),
          clients: state.clients.map((entry) => (entry.id === clientId ? { ...entry, status: 'converted', updatedAt: now() } : entry)),
        });
      },
    }),
    {
      name: 'joe-esports-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        teams: state.teams,
        players: state.players,
        tournaments: state.tournaments,
        matches: state.matches,
        marketplace: state.marketplace,
        sponsors: state.sponsors,
        comments: state.comments,
        cart: state.cart,
        gamerJobs: state.gamerJobs,
        commentators: state.commentators,
        clients: state.clients,
      }),
    },
  ),
);

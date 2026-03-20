'use client';

import Link from 'next/link';
import { EntitySection } from '@/components/EntitySection';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Match, Tournament } from '@/types';

export default function TournamentsPage() {
  const { tournaments, teams, matches, createTournament, updateTournament, deleteTournament, generateFixtures, createMatch, updateMatch, deleteMatch } = useEsportsStore();

  return (
    <div className="page-grid">
      <EntitySection<Tournament>
        title="Tournaments"
        rows={tournaments}
        columns={[
          { key: 'title', label: 'Tournament', render: (row) => <Link href={`/tournaments/${row.id}`}>{row.title}</Link> },
          { key: 'game', label: 'Game', render: (row) => row.game },
          { key: 'format', label: 'Format', render: (row) => row.format },
          { key: 'teams', label: 'Teams', render: (row) => row.teamIds.length },
          { key: 'status', label: 'Status', render: (row) => row.status },
        ]}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'game', label: 'Game' },
          { key: 'format', label: 'Format' },
          { key: 'prizePool', label: 'Prize Pool', type: 'number' },
          { key: 'status', label: 'Status', type: 'select', options: ['draft', 'open', 'completed'].map((value) => ({ label: value, value })) },
          { key: 'teamIds', label: 'Team IDs (comma separated)' },
        ]}
        createItem={(payload) => createTournament(payload as Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updateTournament(id, payload as Partial<Tournament>)}
        deleteItem={deleteTournament}
        toInitialValues={(row) => row ? { ...row, teamIds: row.teamIds.join(',') } : { title: '', game: '', format: '', prizePool: 0, status: 'draft', teamIds: '', matchIds: '' }}
        toPayload={(values) => ({ ...values, prizePool: Number(values.prizePool), teamIds: values.teamIds ? values.teamIds.split(',').map((entry) => entry.trim()).filter(Boolean) : [], matchIds: [] })}
        extraActions={(row) => <button onClick={() => generateFixtures(row.id)}>Generate fixtures</button>}
      />
      <EntitySection<Match>
        title="Matches"
        rows={matches}
        columns={[
          { key: 'title', label: 'Match', render: (row) => row.title },
          { key: 'teams', label: 'Teams', render: (row) => `${teams.find((team) => team.id === row.homeTeamId)?.name ?? 'TBD'} vs ${teams.find((team) => team.id === row.awayTeamId)?.name ?? 'TBD'}` },
          { key: 'score', label: 'Score', render: (row) => `${row.homeScore} - ${row.awayScore}` },
          { key: 'status', label: 'Status', render: (row) => row.status },
          { key: 'scheduledAt', label: 'Scheduled', render: (row) => new Date(row.scheduledAt).toLocaleString() },
        ]}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'tournamentId', label: 'Tournament', type: 'select', options: tournaments.map((entry) => ({ label: entry.title, value: entry.id })) },
          { key: 'homeTeamId', label: 'Home Team', type: 'select', options: teams.map((entry) => ({ label: entry.name, value: entry.id })) },
          { key: 'awayTeamId', label: 'Away Team', type: 'select', options: teams.map((entry) => ({ label: entry.name, value: entry.id })) },
          { key: 'scheduledAt', label: 'Scheduled At', type: 'datetime-local' },
          { key: 'homeScore', label: 'Home Score', type: 'number' },
          { key: 'awayScore', label: 'Away Score', type: 'number' },
          { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'live', 'completed'].map((value) => ({ label: value, value })) },
        ]}
        createItem={(payload) => createMatch(payload as Omit<Match, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updateMatch(id, payload as Partial<Match>)}
        deleteItem={deleteMatch}
        toInitialValues={(row) => row ?? { title: '', tournamentId: '', homeTeamId: '', awayTeamId: '', scheduledAt: '', homeScore: 0, awayScore: 0, status: 'scheduled' }}
        toPayload={(values) => ({ ...values, tournamentId: values.tournamentId || undefined, homeScore: Number(values.homeScore), awayScore: Number(values.awayScore), scheduledAt: new Date(values.scheduledAt).toISOString() })}
      />
    </div>
  );
}

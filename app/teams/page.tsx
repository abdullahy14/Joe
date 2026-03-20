'use client';

import Link from 'next/link';
import { EntitySection } from '@/components/EntitySection';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Player, Team } from '@/types';

export default function TeamsPage() {
  const { teams, players, sponsors, createTeam, updateTeam, deleteTeam, createPlayer, updatePlayer, deletePlayer } = useEsportsStore();

  return (
    <div className="page-grid">
      <EntitySection<Team>
        title="Teams"
        rows={teams}
        columns={[
          { key: 'name', label: 'Team', render: (row) => <Link href={`/teams/${row.id}`}>{row.name}</Link> },
          { key: 'game', label: 'Game', render: (row) => row.game },
          { key: 'region', label: 'Region', render: (row) => row.region },
          { key: 'sponsor', label: 'Sponsor', render: (row) => sponsors.find((entry) => entry.id === row.sponsorId)?.name ?? 'Unassigned' },
          { key: 'players', label: 'Players', render: (row) => row.playerIds.length },
        ]}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'game', label: 'Game' },
          { key: 'region', label: 'Region' },
          { key: 'status', label: 'Status', type: 'select', options: ['active', 'trial', 'archived'].map((value) => ({ label: value, value })) },
          { key: 'sponsorId', label: 'Sponsor', type: 'select', options: sponsors.map((entry) => ({ label: entry.name, value: entry.id })) },
          { key: 'playerIds', label: 'Player IDs (comma separated)' },
        ]}
        createItem={(payload) => createTeam(payload as Omit<Team, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updateTeam(id, payload as Partial<Team>)}
        deleteItem={deleteTeam}
        toInitialValues={(row) => row ? { ...row, playerIds: row.playerIds.join(',') } : { name: '', game: '', region: '', status: 'active', sponsorId: '', playerIds: '' }}
        toPayload={(values) => ({ ...values, sponsorId: values.sponsorId || undefined, playerIds: values.playerIds ? values.playerIds.split(',').map((entry) => entry.trim()).filter(Boolean) : [] })}
      />
      <EntitySection<Player>
        title="Players"
        rows={players}
        columns={[
          { key: 'name', label: 'Player', render: (row) => row.name },
          { key: 'alias', label: 'Alias', render: (row) => row.alias },
          { key: 'role', label: 'Role', render: (row) => row.role },
          { key: 'team', label: 'Team', render: (row) => teams.find((entry) => entry.id === row.teamId)?.name ?? 'Free agent' },
          { key: 'rank', label: 'Rank', render: (row) => row.rank },
        ]}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'alias', label: 'Alias' },
          { key: 'role', label: 'Role' },
          { key: 'rank', label: 'Rank' },
          { key: 'teamId', label: 'Team', type: 'select', options: teams.map((entry) => ({ label: entry.name, value: entry.id })) },
          { key: 'status', label: 'Status', type: 'select', options: ['active', 'benched', 'free-agent'].map((value) => ({ label: value, value })) },
        ]}
        createItem={(payload) => createPlayer(payload as Omit<Player, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updatePlayer(id, payload as Partial<Player>)}
        deleteItem={deletePlayer}
        toInitialValues={(row) => row ?? { name: '', alias: '', role: '', rank: '', teamId: '', status: 'active' }}
        toPayload={(values) => ({ ...values, teamId: values.teamId || undefined })}
      />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal, type FieldConfig } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Team } from '@/types';

const teamFields = (state: ReturnType<typeof useEsportsStore>): FieldConfig[] => [
  { name: 'name', label: 'Team name' },
  { name: 'game', label: 'Game' },
  { name: 'region', label: 'Region' },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'bootcamp', 'scouting'].map((value) => ({ value, label: value })) },
  { name: 'playerIds', label: 'Player IDs (comma separated)', placeholder: 'player-1, player-2' },
  { name: 'sponsorId', label: 'Sponsor', type: 'select', options: state.sponsors.map((item) => ({ value: item.id, label: item.name })) },
];

export function TeamsPage() {
  const state = useEsportsStore();
  const [editing, setEditing] = useState<Team | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const submit = (values: Record<string, string>) => {
    const payload = {
      name: values.name,
      game: values.game,
      region: values.region,
      status: (values.status || 'active') as Team['status'],
      playerIds: values.playerIds.split(',').map((item) => item.trim()).filter(Boolean),
      sponsorId: values.sponsorId || undefined,
    };
    if (editing) state.updateEntity('teams', editing.id, payload);
    else state.createEntity('teams', payload);
  };

  return (
    <>
      <SectionHeader title="Teams" description="Manage esports organizations, assign sponsors, and control roster membership." action={<button className="primary-button" onClick={() => setCreating(true)}>Add team</button>} />
      <DataTable
        columns={['Team', 'Game / region', 'Roster', 'Sponsor', 'Actions']}
        rows={state.teams.map((team) => [
          <div key={team.id}><Link href={`/teams/${team.id}`}><strong>{team.name}</strong></Link><div className="muted small">{team.status}</div></div>,
          `${team.game} • ${team.region}`,
          team.playerIds.map((id) => state.players.find((player) => player.id === id)?.gamerTag ?? id).join(', ') || 'No players',
          state.sponsors.find((sponsor) => sponsor.id === team.sponsorId)?.name ?? 'Unassigned',
          <div key={`${team.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => setEditing(team)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(team.id)}>Delete</button></div>,
        ])}
      />
      <CrudModal title={editing ? 'Edit team' : 'Add team'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={submit} fields={teamFields(state)} initialValues={editing ?? undefined} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete team?" message="This removes the team from local state only." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('teams', deletingId); setDeletingId(null); }} />
    </>
  );
}

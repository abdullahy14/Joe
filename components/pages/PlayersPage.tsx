'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Player } from '@/types';

export function PlayersPage() {
  const state = useEsportsStore();
  const [editing, setEditing] = useState<Player | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Players" description="Track player identities, roles, ranks, and team assignments." action={<button className="primary-button" onClick={() => setCreating(true)}>Add player</button>} />
      <DataTable columns={['Player', 'Role', 'Rank', 'Team', 'Actions']} rows={state.players.map((player) => [
        <div key={player.id}><strong>{player.gamerTag}</strong><div className="muted small">{player.name}</div></div>,
        player.role,
        player.rank,
        state.teams.find((team) => team.id === player.teamId)?.name ?? 'Free agent',
        <div key={`${player.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => setEditing(player)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(player.id)}>Delete</button></div>,
      ])} />
      <CrudModal title={editing ? 'Edit player' : 'Add player'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const payload = { name: values.name, gamerTag: values.gamerTag, role: values.role, rank: values.rank, teamId: values.teamId || undefined };
        if (editing) state.updateEntity('players', editing.id, payload); else state.createEntity('players', payload);
      }} fields={[
        { name: 'name', label: 'Real name' },
        { name: 'gamerTag', label: 'Gamer tag' },
        { name: 'role', label: 'Role' },
        { name: 'rank', label: 'Rank' },
        { name: 'teamId', label: 'Team', type: 'select', options: state.teams.map((team) => ({ value: team.id, label: team.name })) },
      ]} initialValues={editing ?? undefined} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete player?" message="This action only updates local prototype state." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('players', deletingId); setDeletingId(null); }} />
    </>
  );
}

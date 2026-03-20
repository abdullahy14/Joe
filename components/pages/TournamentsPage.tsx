'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Tournament } from '@/types';

export function TournamentsPage() {
  const state = useEsportsStore();
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Tournaments" description="Create tournaments, assign teams, and generate mock fixtures with one click." action={<button className="primary-button" onClick={() => setCreating(true)}>Add tournament</button>} />
      <DataTable columns={['Tournament', 'Teams', 'Starts', 'Prize pool', 'Actions']} rows={state.tournaments.map((tournament) => [
        <div key={tournament.id}><Link href={`/tournaments/${tournament.id}`}><strong>{tournament.title}</strong></Link><div className="muted small">{tournament.game} • {tournament.status}</div></div>,
        tournament.teamIds.map((teamId) => state.teams.find((team) => team.id === teamId)?.name ?? teamId).join(', '),
        formatDate(tournament.startsAt),
        formatCurrency(tournament.prizePool),
        <div key={`${tournament.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => state.generateFixtures(tournament.id)}>Generate fixtures</button><button className="ghost-button" onClick={() => setEditing(tournament)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(tournament.id)}>Delete</button></div>,
      ])} />
      <CrudModal title={editing ? 'Edit tournament' : 'Add tournament'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const payload = {
          name: values.title,
          title: values.title,
          game: values.game,
          status: (values.status || 'draft') as Tournament['status'],
          prizePool: Number(values.prizePool || 0),
          teamIds: values.teamIds.split(',').map((item) => item.trim()).filter(Boolean),
          fixtureMatchIds: editing?.fixtureMatchIds ?? [],
          startsAt: values.startsAt || new Date().toISOString(),
        };
        if (editing) state.updateEntity('tournaments', editing.id, payload); else state.createEntity('tournaments', payload);
      }} fields={[
        { name: 'title', label: 'Title' },
        { name: 'game', label: 'Game' },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'registration', 'live', 'completed'].map((value) => ({ value, label: value })) },
        { name: 'prizePool', label: 'Prize pool', type: 'number' },
        { name: 'startsAt', label: 'Start time', type: 'datetime-local' },
        { name: 'teamIds', label: 'Team IDs (comma separated)', placeholder: state.teams.map((team) => team.id).join(', ') },
      ]} initialValues={editing ? { ...editing, startsAt: editing.startsAt.slice(0, 16) } : undefined} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete tournament?" message="This removes tournament data from the local store only." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('tournaments', deletingId); setDeletingId(null); }} />
    </>
  );
}

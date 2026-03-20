'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatDate } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Match } from '@/types';

export function MatchesPage() {
  const state = useEsportsStore();
  const [editing, setEditing] = useState<Match | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Matches" description="Create standalone matches, update scores manually, and remove outdated fixtures." action={<button className="primary-button" onClick={() => setCreating(true)}>Add match</button>} />
      <DataTable columns={['Match', 'Schedule', 'Score', 'Status', 'Actions']} rows={state.matches.map((match) => [
        <div key={match.id}><strong>{match.title}</strong><div className="muted small">{match.name}</div></div>,
        formatDate(match.scheduledAt),
        `${match.homeScore} - ${match.awayScore}`,
        match.status,
        <div key={`${match.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => setEditing(match)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(match.id)}>Delete</button></div>,
      ])} />
      <CrudModal title={editing ? 'Edit match' : 'Add match'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const homeTeam = state.teams.find((team) => team.id === values.homeTeamId)?.name ?? 'Home';
        const awayTeam = state.teams.find((team) => team.id === values.awayTeamId)?.name ?? 'Away';
        const payload = {
          name: `${homeTeam} vs ${awayTeam}`,
          title: values.title,
          tournamentId: values.tournamentId || undefined,
          homeTeamId: values.homeTeamId,
          awayTeamId: values.awayTeamId,
          scheduledAt: values.scheduledAt || new Date().toISOString(),
          homeScore: Number(values.homeScore || 0),
          awayScore: Number(values.awayScore || 0),
          status: (values.status || 'scheduled') as Match['status'],
        };
        if (editing) state.updateEntity('matches', editing.id, payload); else state.createEntity('matches', payload);
      }} fields={[
        { name: 'title', label: 'Title' },
        { name: 'tournamentId', label: 'Tournament', type: 'select', options: state.tournaments.map((item) => ({ value: item.id, label: item.title })) },
        { name: 'homeTeamId', label: 'Home team', type: 'select', options: state.teams.map((item) => ({ value: item.id, label: item.name })) },
        { name: 'awayTeamId', label: 'Away team', type: 'select', options: state.teams.map((item) => ({ value: item.id, label: item.name })) },
        { name: 'scheduledAt', label: 'Scheduled at', type: 'datetime-local' },
        { name: 'homeScore', label: 'Home score', type: 'number' },
        { name: 'awayScore', label: 'Away score', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: ['scheduled', 'live', 'finished'].map((value) => ({ value, label: value })) },
      ]} initialValues={editing ? { ...editing, scheduledAt: editing.scheduledAt.slice(0, 16) } : undefined} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete match?" message="This action only affects local mock state." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('matches', deletingId); setDeletingId(null); }} />
    </>
  );
}

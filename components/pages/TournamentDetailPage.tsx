'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Match } from '@/types';

export function TournamentDetailPage({ id }: { id: string }) {
  const state = useEsportsStore();
  const tournament = state.tournaments.find((entry) => entry.id === id);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  if (!tournament) {
    return <SectionHeader title="Tournament not found" description="Choose another tournament from the list." action={<Link href="/tournaments" className="ghost-button">Back</Link>} />;
  }

  const matches = state.matches.filter((match) => match.tournamentId === tournament.id || tournament.fixtureMatchIds.includes(match.id));

  return (
    <>
      <SectionHeader title={tournament.title} description={`${tournament.game} tournament with mock fixture generation and local result editing.`} action={<div className="inline-actions"><button className="primary-button" onClick={() => state.generateFixtures(tournament.id)}>Generate fixtures</button><Link href="/tournaments" className="ghost-button">Back</Link></div>} />
      <div className="grid-two">
        <section className="card list-card">
          <div className="split"><span className="muted">Status</span><span className="chip">{tournament.status}</span></div>
          <div className="split"><span className="muted">Prize pool</span><span>{formatCurrency(tournament.prizePool)}</span></div>
          <div className="split"><span className="muted">Starts</span><span>{formatDate(tournament.startsAt)}</span></div>
        </section>
        <section className="card list-card">
          <p className="eyebrow">Registered teams</p>
          {tournament.teamIds.map((teamId) => <div key={teamId} className="split"><span>{state.teams.find((team) => team.id === teamId)?.name ?? teamId}</span><span className="muted">{teamId}</span></div>)}
        </section>
      </div>
      <DataTable columns={['Fixture', 'Schedule', 'Score', 'Actions']} rows={matches.map((match) => [
        <div key={match.id}><strong>{match.title}</strong><div className="muted small">{match.name}</div></div>,
        formatDate(match.scheduledAt),
        `${match.homeScore} - ${match.awayScore}`,
        <button key={`${match.id}-edit`} className="ghost-button" onClick={() => setEditingMatch(match)}>Update result</button>,
      ])} />
      <DataTable columns={['Comments', 'Author']} rows={state.comments.filter((comment) => comment.entityType === 'tournament' && comment.entityId === tournament.id).map((comment) => [<div key={comment.id}><strong>{comment.title}</strong><div className="muted small">{comment.message}</div></div>, comment.author])} />
      <CrudModal title="Update match result" open={Boolean(editingMatch)} onClose={() => setEditingMatch(null)} onSubmit={(values) => {
        if (!editingMatch) return;
        state.updateEntity('matches', editingMatch.id, { homeScore: Number(values.homeScore || 0), awayScore: Number(values.awayScore || 0), status: values.status as Match['status'] });
      }} fields={[{ name: 'homeScore', label: 'Home score', type: 'number' }, { name: 'awayScore', label: 'Away score', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: ['scheduled', 'live', 'finished'].map((value) => ({ value, label: value })) }]} initialValues={editingMatch ?? undefined} />
    </>
  );
}

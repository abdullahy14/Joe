'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { useEsportsStore } from '@/store/useEsportsStore';
import { formatDate } from '@/lib/utils';

export function TeamDetailPage({ id }: { id: string }) {
  const state = useEsportsStore();
  const team = state.teams.find((entry) => entry.id === id);

  if (!team) {
    return <SectionHeader title="Team not found" description="Return to the teams page to select a valid local record." action={<Link href="/teams" className="ghost-button">Back</Link>} />;
  }

  const roster = state.players.filter((player) => team.playerIds.includes(player.id) || player.teamId === team.id);

  return (
    <>
      <SectionHeader title={team.name} description={`${team.game} roster in ${team.region}. Sponsors, players, and timestamps are all mock-managed locally.`} action={<Link href="/teams" className="ghost-button">Back to teams</Link>} />
      <div className="grid-two">
        <section className="card list-card">
          <p className="eyebrow">Profile</p>
          <div className="split"><span className="muted">Status</span><span className="chip">{team.status}</span></div>
          <div className="split"><span className="muted">Sponsor</span><span>{state.sponsors.find((item) => item.id === team.sponsorId)?.name ?? 'Unassigned'}</span></div>
          <div className="split"><span className="muted">Created</span><span>{formatDate(team.createdAt)}</span></div>
          <div className="split"><span className="muted">Updated</span><span>{formatDate(team.updatedAt)}</span></div>
        </section>
        <section className="card list-card">
          <p className="eyebrow">Roster</p>
          {roster.length === 0 ? <p className="muted">No players assigned yet.</p> : roster.map((player) => <div key={player.id} className="split"><span>{player.gamerTag}</span><span className="muted">{player.role} • {player.rank}</span></div>)}
        </section>
      </div>
    </>
  );
}

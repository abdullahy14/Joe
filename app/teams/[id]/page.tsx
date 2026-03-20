'use client';

import { useParams } from 'next/navigation';
import { useEsportsStore } from '@/store/useEsportsStore';

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const { teams, players, sponsors, updateTeam, updatePlayer } = useEsportsStore();
  const team = teams.find((entry) => entry.id === params.id);
  if (!team) return <div className="card">Team not found.</div>;
  const availablePlayers = players.filter((player) => !player.teamId || player.teamId === team.id);

  return (
    <div className="page-grid two-column">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>{team.name}</h2>
            <p className="muted">{team.game} · {team.region} · {team.status}</p>
          </div>
          <span className="badge">Sponsor: {sponsors.find((entry) => entry.id === team.sponsorId)?.name ?? 'None'}</span>
        </div>
        <h3>Roster Management</h3>
        <div className="stack-list">
          {availablePlayers.map((player) => {
            const assigned = player.teamId === team.id;
            return (
              <article key={player.id} className="list-item">
                <div>
                  <strong>{player.alias}</strong>
                  <p className="muted">{player.name} · {player.role} · {player.rank}</p>
                </div>
                <button onClick={() => {
                  updatePlayer(player.id, { teamId: assigned ? undefined : team.id });
                  updateTeam(team.id, {
                    playerIds: assigned ? team.playerIds.filter((id) => id !== player.id) : [...new Set([...team.playerIds, player.id])],
                  });
                }}>{assigned ? 'Remove from team' : 'Add to team'}</button>
              </article>
            );
          })}
        </div>
      </section>
      <section className="card">
        <div className="section-header">
          <h2>Team Snapshot</h2>
          <span className="muted">Roster + sponsor status</span>
        </div>
        <div className="stack-list">
          <div className="list-item"><span>Assigned players</span><strong>{team.playerIds.length}</strong></div>
          <div className="list-item"><span>Sponsor</span><strong>{sponsors.find((entry) => entry.id === team.sponsorId)?.name ?? 'None'}</strong></div>
          <div className="list-item"><span>Region</span><strong>{team.region}</strong></div>
          <div className="list-item"><span>Status</span><strong>{team.status}</strong></div>
        </div>
      </section>
    </div>
  );
}

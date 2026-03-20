'use client';

import { useParams } from 'next/navigation';
import { CommentsPanel } from '@/components/CommentsPanel';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';

export default function TournamentDetailPage() {
  const params = useParams<{ id: string }>();
  const { tournaments, teams, matches, updateTournament, updateMatch, generateFixtures } = useEsportsStore();
  const tournament = tournaments.find((entry) => entry.id === params.id);
  if (!tournament) return <div className="card">Tournament not found.</div>;
  const tournamentMatches = matches.filter((match) => match.tournamentId === tournament.id);

  return (
    <div className="page-grid two-column">
      <section className="card">
        <div className="section-header">
          <div>
            <h2>{tournament.title}</h2>
            <p className="muted">{tournament.game} · {tournament.format} · Prize Pool {formatCurrency(tournament.prizePool)}</p>
          </div>
          <button onClick={() => generateFixtures(tournament.id)}>Generate fixtures</button>
        </div>
        <h3>Assign Teams</h3>
        <div className="stack-list">
          {teams.map((team) => {
            const assigned = tournament.teamIds.includes(team.id);
            return (
              <article key={team.id} className="list-item">
                <div>
                  <strong>{team.name}</strong>
                  <p className="muted">{team.game} · {team.region}</p>
                </div>
                <button onClick={() => updateTournament(tournament.id, { teamIds: assigned ? tournament.teamIds.filter((id) => id !== team.id) : [...new Set([...tournament.teamIds, team.id])] })}>
                  {assigned ? 'Remove' : 'Assign'}
                </button>
              </article>
            );
          })}
        </div>
        <h3>Match Results</h3>
        <div className="stack-list">
          {tournamentMatches.map((match) => (
            <article key={match.id} className="list-item">
              <div>
                <strong>{match.title}</strong>
                <p className="muted">{teams.find((team) => team.id === match.homeTeamId)?.name} vs {teams.find((team) => team.id === match.awayTeamId)?.name}</p>
              </div>
              <div className="table-actions">
                <button onClick={() => updateMatch(match.id, { homeScore: match.homeScore + 1, status: 'live' })}>Home +1</button>
                <button onClick={() => updateMatch(match.id, { awayScore: match.awayScore + 1, status: 'live' })}>Away +1</button>
                <button className="ghost-button" onClick={() => updateMatch(match.id, { status: 'completed' })}>Finalize</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="page-grid">
        <CommentsPanel entityType="tournament" entityId={tournament.id} />
        {tournamentMatches[0] ? <CommentsPanel entityType="match" entityId={tournamentMatches[0].id} /> : null}
      </div>
    </div>
  );
}

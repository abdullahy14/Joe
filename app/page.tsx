'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { StatsGrid } from '@/components/StatsGrid';
import { DataTable } from '@/components/DataTable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { selectTotals, useEsportsStore } from '@/store/useEsportsStore';

export default function DashboardPage() {
  const state = useEsportsStore();
  const totals = selectTotals(state);

  return (
    <>
      <SectionHeader
        title="Operations Dashboard"
        description="Monitor your offline esports ecosystem with mock live data, fixture generation, and storefront simulations."
        action={<Link href="/tournaments" className="primary-button">Open tournament hub</Link>}
      />

      <div className="hero-grid">
        <section className="hero card">
          <p className="eyebrow">Prototype status</p>
          <h2>Everything runs locally with Zustand + static JSON seeds.</h2>
          <p className="muted">No auth, no backend, no database, and no third-party APIs. All CRUD actions are simulated in the browser for safe offline testing.</p>
          <div className="inline-actions">
            <Link href="/marketplace" className="ghost-button">Marketplace</Link>
            <Link href="/teams" className="ghost-button">Roster control</Link>
            <Link href="/gamer-work" className="ghost-button">Gamer work</Link>
          </div>
        </section>
        <section className="card list-card">
          <p className="eyebrow">Quick state</p>
          <div className="split"><span className="muted">Cart items</span><strong>{totals.cartCount}</strong></div>
          <div className="split"><span className="muted">Completed jobs</span><strong>{totals.completedJobs}</strong></div>
          <div className="split"><span className="muted">Earnings</span><strong>{formatCurrency(totals.earnings)}</strong></div>
          <div className="split"><span className="muted">Live tournaments</span><strong>{state.tournaments.filter((item) => item.status === 'live').length}</strong></div>
        </section>
      </div>

      <StatsGrid
        items={[
          { label: 'Teams', value: String(state.teams.length), helper: 'Create, edit, delete, and assign sponsors.' },
          { label: 'Players', value: String(state.players.length), helper: 'Manage roster roles and ranks.' },
          { label: 'Matches', value: String(state.matches.length), helper: 'Manual result updates supported.' },
          { label: 'Marketplace listings', value: String(state.marketplace.length), helper: 'Cart and fake checkout included.' },
        ]}
      />

      <DataTable
        columns={['Upcoming matches', 'Tournament', 'Schedule', 'Result']}
        rows={state.matches.slice(0, 5).map((match) => [
          <div key={match.id}><strong>{match.title}</strong><div className="muted small">{match.name}</div></div>,
          state.tournaments.find((entry) => entry.id === match.tournamentId)?.title ?? 'Independent',
          formatDate(match.scheduledAt),
          `${match.homeScore} - ${match.awayScore}`,
        ])}
      />
    </>
  );
}

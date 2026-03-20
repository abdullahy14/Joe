'use client';

import Link from 'next/link';
import { StatCards } from '@/components/StatCards';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';

export default function HomePage() {
  const { tournaments, matches, sponsors, marketplace, gamerJobs } = useEsportsStore();
  const openJobs = gamerJobs.filter((job) => job.status === 'open');

  return (
    <div className="page-grid">
      <StatCards />
      <section className="hero">
        <article className="card">
          <span className="badge">Command Center</span>
          <h2>Run teams, events, commerce, and talent from one local dashboard.</h2>
          <p className="muted">
            This prototype simulates a production esports platform without authentication, backend services, databases, or live APIs.
          </p>
          <div className="top-actions">
            <Link href="/tournaments"><button>Tournament hub</button></Link>
            <Link href="/marketplace"><button className="ghost-button">Marketplace</button></Link>
          </div>
        </article>
        <article className="card">
          <h2>Live mock pulse</h2>
          <div className="stack-list">
            <div className="list-item"><span>Tournaments</span><strong>{tournaments.length}</strong></div>
            <div className="list-item"><span>Matches tracked</span><strong>{matches.length}</strong></div>
            <div className="list-item"><span>Sponsor budget</span><strong>{formatCurrency(sponsors.reduce((sum, sponsor) => sum + sponsor.budget, 0))}</strong></div>
            <div className="list-item"><span>Marketplace listings</span><strong>{marketplace.length}</strong></div>
            <div className="list-item"><span>Open gamer jobs</span><strong>{openJobs.length}</strong></div>
          </div>
        </article>
      </section>
      <section className="grid-two">
        <article className="card">
          <div className="section-header"><h2>Operations checklist</h2><span className="muted">Prototype flow</span></div>
          <div className="stack-list">
            <div className="list-item"><div><strong>Create teams and players</strong><p className="muted">Build lineups, assign sponsors, and manage rosters.</p></div><Link href="/teams">Open</Link></div>
            <div className="list-item"><div><strong>Launch tournaments</strong><p className="muted">Assign teams, auto-generate fixtures, and update results.</p></div><Link href="/tournaments">Open</Link></div>
            <div className="list-item"><div><strong>Sell digital services</strong><p className="muted">Manage marketplace products and simulate fake checkout.</p></div><Link href="/marketplace">Open</Link></div>
          </div>
        </article>
        <article className="card">
          <div className="section-header"><h2>Offline-only rules</h2><span className="muted">Important</span></div>
          <ul>
            <li>No authentication.</li>
            <li>No backend server or database.</li>
            <li>All data comes from JSON seeds and Zustand local state.</li>
            <li>All transactions, team conversions, and comments are simulated locally.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

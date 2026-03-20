'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEsportsStore, selectTotals } from '@/store/useEsportsStore';

const links = [
  ['/', 'Dashboard'],
  ['/teams', 'Teams'],
  ['/players', 'Players'],
  ['/tournaments', 'Tournaments'],
  ['/matches', 'Matches'],
  ['/marketplace', 'Marketplace'],
  ['/gamer-work', 'Gamer Work'],
  ['/commentators', 'Commentators'],
  ['/clients', 'Clients'],
  ['/sponsors', 'Sponsors'],
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useEsportsStore();
  const totals = selectTotals(state);

  return (
    <div className="layout-shell">
      <aside className="sidebar card">
        <div>
          <p className="eyebrow">Offline prototype</p>
          <h1>Esports Nexus</h1>
          <p className="muted">Frontend-only operations board for tournaments, teams, jobs, and marketplace flows.</p>
        </div>
        <nav className="nav-grid">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href || pathname.startsWith(`${href}/`) ? 'nav-link active' : 'nav-link'}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-stats">
          <div>
            <span className="muted">Cart items</span>
            <strong>{totals.cartCount}</strong>
          </div>
          <div>
            <span className="muted">Job earnings</span>
            <strong>${totals.earnings}</strong>
          </div>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

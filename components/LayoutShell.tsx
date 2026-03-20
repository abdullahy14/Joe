'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navItems = [
  ['/', 'Dashboard'],
  ['/teams', 'Teams'],
  ['/tournaments', 'Tournaments'],
  ['/marketplace', 'Marketplace'],
  ['/gamer-work', 'Gamer Work'],
  ['/commentators', 'Commentators'],
  ['/clients', 'Clients'],
  ['/sponsors', 'Sponsors'],
];

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand">JOE // ESPORTS OPS</div>
          <p className="muted">Offline prototype · mock data · no auth</p>
        </div>
        <nav className="nav-list">
          {navItems.map(([href, label]) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Local offline testing only</span>
            <h1>Esports platform prototype</h1>
          </div>
          <div className="pill">App Router + Zustand</div>
        </header>
        {children}
      </main>
    </div>
  );
}

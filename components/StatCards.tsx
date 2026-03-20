'use client';

import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';

export function StatCards() {
  const { teams, players, tournaments, marketplace, cart, gamerJobs } = useEsportsStore();
  const earnings = gamerJobs.filter((job) => job.status === 'completed').reduce((sum, job) => sum + job.reward, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = marketplace.find((entry) => entry.id === item.marketplaceItemId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const stats = [
    ['Teams', teams.length.toString()],
    ['Players', players.length.toString()],
    ['Tournaments', tournaments.length.toString()],
    ['Marketplace Cart', formatCurrency(cartTotal)],
    ['Completed Earnings', formatCurrency(earnings)],
  ];

  return (
    <section className="stats-grid">
      {stats.map(([label, value]) => (
        <article key={label} className="card stat-card">
          <span className="muted">{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  );
}

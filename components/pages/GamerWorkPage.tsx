'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { SectionHeader } from '@/components/SectionHeader';
import { StatsGrid } from '@/components/StatsGrid';
import { formatCurrency } from '@/lib/utils';
import { selectTotals, useEsportsStore } from '@/store/useEsportsStore';

export function GamerWorkPage() {
  const state = useEsportsStore();
  const totals = selectTotals(state);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Gamer Work" description="Simulate creator tasks, earnings tracking, and completion status with local-only state." action={<button className="primary-button" onClick={() => setCreating(true)}>Add job</button>} />
      <StatsGrid items={[{ label: 'Completed jobs', value: String(totals.completedJobs) }, { label: 'Mock earnings', value: formatCurrency(totals.earnings) }, { label: 'Open jobs', value: String(state.gamerJobs.filter((job) => !job.completed).length) }]} />
      <div className="grid-two">
        {state.gamerJobs.map((job) => (
          <section key={job.id} className="card list-card">
            <div className="split"><strong>{job.title}</strong><span className="chip">{job.completed ? 'Completed' : 'Open'}</span></div>
            <p className="muted">Reward: {formatCurrency(job.reward)}</p>
            <div className="inline-actions">
              <button className="ghost-button" onClick={() => state.toggleJobCompletion(job.id)}>{job.completed ? 'Mark open' : 'Mark complete'}</button>
              <button className="danger-button" onClick={() => setDeletingId(job.id)}>Delete</button>
            </div>
          </section>
        ))}
      </div>
      <CrudModal title="Add gamer job" open={creating} onClose={() => setCreating(false)} onSubmit={(values) => state.createEntity('gamerJobs', { name: values.title, title: values.title, reward: Number(values.reward || 0), completed: false })} fields={[{ name: 'title', label: 'Task title' }, { name: 'reward', label: 'Reward', type: 'number' }]} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete job?" message="The job will be removed from in-browser state." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('gamerJobs', deletingId); setDeletingId(null); }} />
    </>
  );
}

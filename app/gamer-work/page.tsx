'use client';

import { EntitySection } from '@/components/EntitySection';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { GamerJob } from '@/types';

export default function GamerWorkPage() {
  const { gamerJobs, createGamerJob, updateGamerJob, deleteGamerJob } = useEsportsStore();
  const completed = gamerJobs.filter((job) => job.status === 'completed');
  const earnings = completed.reduce((sum, job) => sum + job.reward, 0);

  return (
    <div className="page-grid two-column">
      <EntitySection<GamerJob>
        title="Gamer Work"
        rows={gamerJobs}
        columns={[
          { key: 'title', label: 'Task', render: (row) => row.title },
          { key: 'reward', label: 'Reward', render: (row) => formatCurrency(row.reward) },
          { key: 'status', label: 'Status', render: (row) => row.status },
        ]}
        fields={[
          { key: 'title', label: 'Task title' },
          { key: 'reward', label: 'Reward', type: 'number' },
          { key: 'status', label: 'Status', type: 'select', options: ['open', 'completed'].map((value) => ({ label: value, value })) },
        ]}
        createItem={(payload) => createGamerJob(payload as Omit<GamerJob, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updateGamerJob(id, payload as Partial<GamerJob>)}
        deleteItem={deleteGamerJob}
        toInitialValues={(row) => row ?? { title: '', reward: 0, status: 'open' }}
        toPayload={(values) => ({ ...values, reward: Number(values.reward) })}
      />
      <section className="card">
        <div className="section-header"><h2>Performance</h2><span className="muted">Mock earnings</span></div>
        <div className="stack-list">
          <div className="list-item"><span>Completed jobs</span><strong>{completed.length}</strong></div>
          <div className="list-item"><span>Total earnings</span><strong>{formatCurrency(earnings)}</strong></div>
          <div className="list-item"><span>Open jobs</span><strong>{gamerJobs.length - completed.length}</strong></div>
        </div>
      </section>
    </div>
  );
}

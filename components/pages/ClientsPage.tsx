'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';

export function ClientsPage() {
  const state = useEsportsStore();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Clients" description="Track prospective clients and simulate conversion into new esports teams." action={<button className="primary-button" onClick={() => setCreating(true)}>Add client</button>} />
      <DataTable columns={['Client', 'Requested game', 'Budget', 'Status', 'Actions']} rows={state.clients.map((client) => [
        <div key={client.id}><strong>{client.company}</strong><div className="muted small">{client.title}</div></div>,
        client.requestedGame,
        formatCurrency(client.budget),
        client.status,
        <div key={`${client.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => state.convertClientToTeam(client.id)}>Convert → team</button><button className="danger-button" onClick={() => setDeletingId(client.id)}>Delete</button></div>,
      ])} />
      <CrudModal title="Add client" open={creating} onClose={() => setCreating(false)} onSubmit={(values) => state.createEntity('clients', { name: values.company, title: values.title, company: values.company, requestedGame: values.requestedGame, budget: Number(values.budget || 0), status: 'lead' })} fields={[{ name: 'title', label: 'Pipeline title' }, { name: 'company', label: 'Company' }, { name: 'requestedGame', label: 'Requested game' }, { name: 'budget', label: 'Budget', type: 'number' }]} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete client?" message="This removes the client from local pipeline state." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('clients', deletingId); setDeletingId(null); }} />
    </>
  );
}

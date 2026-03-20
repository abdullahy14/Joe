'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Sponsor } from '@/types';

export function SponsorsPage() {
  const state = useEsportsStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Sponsors" description="Maintain sponsor records and assign them to teams inside the offline prototype." action={<button className="primary-button" onClick={() => setCreating(true)}>Add sponsor</button>} />
      <DataTable columns={['Sponsor', 'Industry', 'Tier', 'Budget', 'Actions']} rows={state.sponsors.map((sponsor) => [
        <div key={sponsor.id}><strong>{sponsor.name}</strong></div>,
        sponsor.industry,
        sponsor.tier,
        formatCurrency(sponsor.budget),
        <div key={`${sponsor.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => setEditing(sponsor)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(sponsor.id)}>Delete</button></div>,
      ])} />
      <CrudModal title={editing ? 'Edit sponsor' : 'Add sponsor'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const payload = { name: values.name, industry: values.industry, tier: (values.tier || 'Bronze') as Sponsor['tier'], budget: Number(values.budget || 0) };
        if (editing) state.updateEntity('sponsors', editing.id, payload); else state.createEntity('sponsors', payload);
      }} fields={[{ name: 'name', label: 'Name' }, { name: 'industry', label: 'Industry' }, { name: 'tier', label: 'Tier', type: 'select', options: ['Gold', 'Silver', 'Bronze'].map((value) => ({ value, label: value })) }, { name: 'budget', label: 'Budget', type: 'number' }]} initialValues={editing ?? undefined} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete sponsor?" message="The sponsor will be removed from local state only." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('sponsors', deletingId); setDeletingId(null); }} />
    </>
  );
}

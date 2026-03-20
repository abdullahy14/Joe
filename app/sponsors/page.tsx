'use client';

import { EntitySection } from '@/components/EntitySection';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Sponsor } from '@/types';

export default function SponsorsPage() {
  const { sponsors, createSponsor, updateSponsor, deleteSponsor } = useEsportsStore();

  return (
    <div className="page-grid">
      <EntitySection<Sponsor>
        title="Sponsors"
        rows={sponsors}
        columns={[
          { key: 'name', label: 'Name', render: (row) => row.name },
          { key: 'tier', label: 'Tier', render: (row) => row.tier },
          { key: 'budget', label: 'Budget', render: (row) => formatCurrency(row.budget) },
          { key: 'focus', label: 'Focus', render: (row) => row.focus },
        ]}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'tier', label: 'Tier' },
          { key: 'budget', label: 'Budget', type: 'number' },
          { key: 'focus', label: 'Focus', type: 'textarea' },
        ]}
        createItem={(payload) => createSponsor(payload as Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={(id, payload) => updateSponsor(id, payload as Partial<Sponsor>)}
        deleteItem={deleteSponsor}
        toInitialValues={(row) => row ?? { name: '', tier: '', budget: 0, focus: '' }}
        toPayload={(values) => ({ ...values, budget: Number(values.budget) })}
      />
    </div>
  );
}

'use client';

import { EntitySection } from '@/components/EntitySection';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Client } from '@/types';

export default function ClientsPage() {
  const { clients, createClient, deleteClient, convertClientToTeam } = useEsportsStore();

  return (
    <div className="page-grid">
      <EntitySection<Client>
        title="Clients"
        rows={clients}
        columns={[
          { key: 'name', label: 'Client', render: (row) => row.name },
          { key: 'game', label: 'Game', render: (row) => row.game },
          { key: 'region', label: 'Region', render: (row) => row.region },
          { key: 'status', label: 'Status', render: (row) => row.status },
        ]}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'game', label: 'Game' },
          { key: 'region', label: 'Region' },
          { key: 'status', label: 'Status', type: 'select', options: ['lead', 'converted'].map((value) => ({ label: value, value })) },
        ]}
        createItem={(payload) => createClient(payload as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={() => undefined}
        deleteItem={deleteClient}
        toInitialValues={(row) => row ?? { name: '', game: '', region: '', status: 'lead' }}
        toPayload={(values) => values}
        extraActions={(row) => <button onClick={() => convertClientToTeam(row.id)}>Convert → Team</button>}
        canEdit={false}
      />
    </div>
  );
}

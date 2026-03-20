'use client';

import { EntitySection } from '@/components/EntitySection';
import { CommentsPanel } from '@/components/CommentsPanel';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Commentator } from '@/types';

export default function CommentatorsPage() {
  const { commentators, createCommentator, deleteCommentator } = useEsportsStore();
  const featured = commentators[0];

  return (
    <div className="page-grid two-column">
      <EntitySection<Commentator>
        title="Commentators"
        rows={commentators}
        columns={[
          { key: 'name', label: 'Name', render: (row) => row.name },
          { key: 'specialty', label: 'Specialty', render: (row) => row.specialty },
          { key: 'style', label: 'Style', render: (row) => row.style },
        ]}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'specialty', label: 'Specialty' },
          { key: 'style', label: 'Style' },
        ]}
        createItem={(payload) => createCommentator(payload as Omit<Commentator, 'id' | 'createdAt' | 'updatedAt'>)}
        updateItem={() => undefined}
        deleteItem={deleteCommentator}
        toInitialValues={(row) => row ?? { name: '', specialty: '', style: '' }}
        toPayload={(values) => values}
        canEdit={false}
      />
      {featured ? <CommentsPanel entityType="commentator" entityId={featured.id} /> : null}
    </div>
  );
}

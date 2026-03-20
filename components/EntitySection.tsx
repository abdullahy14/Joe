'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudTable } from '@/components/CrudTable';
import { EntityForm } from '@/components/EntityForm';
import { Modal } from '@/components/Modal';

export function EntitySection<T extends { id: string; updatedAt: string }>({
  title,
  rows,
  columns,
  fields,
  createItem,
  updateItem,
  deleteItem,
  toInitialValues,
  toPayload,
  extraActions,
  canEdit = true,
}: {
  title: string;
  rows: T[];
  columns: { key: string; label: string; render: (row: T) => ReactNode }[];
  fields: { key: string; label: string; type?: 'text' | 'number' | 'textarea' | 'select' | 'datetime-local'; options?: { label: string; value: string }[] }[];
  createItem: (payload: Record<string, unknown>) => void;
  updateItem: (id: string, payload: Record<string, unknown>) => void;
  deleteItem: (id: string) => void;
  toInitialValues: (row?: T) => Record<string, string | number | undefined>;
  toPayload: (values: Record<string, string>) => Record<string, unknown>;
  extraActions?: (row: T) => ReactNode;
  canEdit?: boolean;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);
  const initialValues = useMemo(() => toInitialValues(editing ?? undefined), [editing, toInitialValues]);

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>{title}</h2>
          <p className="muted">Simulated CRUD with local state and delete confirmations.</p>
        </div>
        <button onClick={() => setCreating(true)}>Add</button>
      </div>
      <CrudTable title={title} rows={rows} columns={columns} onEdit={canEdit ? setEditing : undefined} onDelete={setDeleting} extraActions={extraActions} />
      <Modal open={creating || Boolean(editing)} title={editing ? `Edit ${title}` : `Add ${title}`} onClose={() => { setCreating(false); setEditing(null); }}>
        <EntityForm
          fields={fields}
          initialValues={initialValues}
          submitLabel={editing ? 'Update' : 'Create'}
          onSubmit={(values) => {
            const payload = toPayload(values);
            if (editing) {
              updateItem(editing.id, payload);
            } else {
              createItem(payload);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${title}`}
        message={`Are you sure you want to delete ${deleting ? (deleting as { name?: string; title?: string }).name ?? (deleting as { title?: string }).title ?? 'this record' : 'this record'}?`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteItem(deleting.id);
          setDeleting(null);
        }}
      />
    </>
  );
}

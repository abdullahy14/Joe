'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';

export type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'datetime-local';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export function CrudModal({
  title,
  open,
  onClose,
  onSubmit,
  fields,
  initialValues,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  fields: FieldConfig[];
  initialValues?: Record<string, string | number | string[] | undefined>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const nextValues = Object.fromEntries(
      fields.map((field) => [field.name, Array.isArray(initialValues?.[field.name]) ? (initialValues?.[field.name] as string[]).join(', ') : String(initialValues?.[field.name] ?? '')]),
    );
    setValues(nextValues);
  }, [fields, initialValues, open]);

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <form
        className="stack-md"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(values);
          onClose();
        }}
      >
        {fields.map((field) => (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea value={values[field.name] ?? ''} placeholder={field.placeholder} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} />
            ) : field.type === 'select' ? (
              <select value={values[field.name] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}>
                <option value="">Select…</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? 'text'}
                value={values[field.name] ?? ''}
                placeholder={field.placeholder}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              />
            )}
          </label>
        ))}
        <div className="inline-actions">
          <button className="primary-button" type="submit">Save</button>
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

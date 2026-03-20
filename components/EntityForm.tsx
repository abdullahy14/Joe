'use client';

import { useEffect, useMemo, useState } from 'react';

type Field = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'datetime-local';
  options?: { label: string; value: string }[];
};

export function EntityForm({
  fields,
  initialValues,
  onSubmit,
  submitLabel,
}: {
  fields: Field[];
  initialValues: Record<string, string | number | undefined>;
  onSubmit: (values: Record<string, string>) => void;
  submitLabel: string;
}) {
  const initial = useMemo(() => {
    const values: Record<string, string> = {};
    fields.forEach((field) => {
      values[field.key] = String(initialValues[field.key] ?? '');
    });
    return values;
  }, [fields, initialValues]);

  const [values, setValues] = useState<Record<string, string>>(initial);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      {fields.map((field) => (
        <label key={field.key} className={field.type === 'textarea' ? 'full-span' : ''}>
          <span>{field.label}</span>
          {field.type === 'textarea' ? (
            <textarea value={values[field.key]} onChange={(event) => setValues((state) => ({ ...state, [field.key]: event.target.value }))} />
          ) : field.type === 'select' ? (
            <select value={values[field.key]} onChange={(event) => setValues((state) => ({ ...state, [field.key]: event.target.value }))}>
              <option value="">Select…</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type ?? 'text'}
              value={values[field.key]}
              onChange={(event) => setValues((state) => ({ ...state, [field.key]: event.target.value }))}
            />
          )}
        </label>
      ))}
      <div className="full-span modal-actions">
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

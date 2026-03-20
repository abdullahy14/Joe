'use client';

import type { ReactNode } from 'react';
import { formatDate } from '@/lib/utils';

type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
};

export function CrudTable<T extends { id: string; updatedAt: string }>({
  title,
  rows,
  columns,
  onEdit,
  onDelete,
  extraActions,
}: {
  title: string;
  rows: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: (row: T) => ReactNode;
}) {
  return (
    <section className="card">
      <div className="section-header">
        <h2>{title}</h2>
        <span className="muted">{rows.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
                <td>{formatDate(row.updatedAt)}</td>
                <td>
                  <div className="table-actions">
                    {extraActions?.(row)}
                    {onEdit ? <button onClick={() => onEdit(row)}>Edit</button> : null}
                    {onDelete ? <button className="danger-button" onClick={() => onDelete(row)}>Delete</button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

'use client';

import { Modal } from '@/components/Modal';

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="modal-actions">
        <button className="ghost-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="danger-button" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}

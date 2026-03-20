'use client';

import { Modal } from '@/components/Modal';

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} open={open} onClose={onClose}>
      <div className="stack-md">
        <p className="muted">{message}</p>
        <div className="inline-actions">
          <button className="danger-button" onClick={onConfirm}>Delete</button>
          <button className="ghost-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

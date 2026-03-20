'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { Commentator } from '@/types';

export function CommentatorsPage() {
  const state = useEsportsStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Commentator | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [commenting, setCommenting] = useState(false);
  const [commentDeleteId, setCommentDeleteId] = useState<string | null>(null);

  return (
    <>
      <SectionHeader title="Commentators" description="Manage mock broadcast talent and add commentary notes linked to matches or tournaments." action={<div className="inline-actions"><button className="primary-button" onClick={() => setCreating(true)}>Add commentator</button><button className="ghost-button" onClick={() => setCommenting(true)}>Add comment</button></div>} />
      <DataTable columns={['Commentator', 'Specialty', 'Experience', 'Actions']} rows={state.commentators.map((commentator) => [
        <div key={commentator.id}><strong>{commentator.name}</strong><div className="muted small">{commentator.title}</div></div>,
        commentator.specialty,
        `${commentator.experience} years`,
        <div key={`${commentator.id}-actions`} className="inline-actions"><button className="ghost-button" onClick={() => setEditing(commentator)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(commentator.id)}>Delete</button></div>,
      ])} />
      <DataTable columns={['Comment', 'Linked to', 'Author', 'Actions']} rows={state.comments.map((comment) => [
        <div key={comment.id}><strong>{comment.title}</strong><div className="muted small">{comment.message}</div></div>,
        `${comment.entityType}: ${comment.entityId}`,
        comment.author,
        <button key={`${comment.id}-delete`} className="danger-button" onClick={() => setCommentDeleteId(comment.id)}>Delete</button>,
      ])} />
      <CrudModal title={editing ? 'Edit commentator' : 'Add commentator'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const payload = { name: values.name, title: values.title, specialty: values.specialty, experience: Number(values.experience || 0) };
        if (editing) state.updateEntity('commentators', editing.id, payload); else state.createEntity('commentators', payload);
      }} fields={[{ name: 'name', label: 'Name' }, { name: 'title', label: 'Broadcast title' }, { name: 'specialty', label: 'Specialty' }, { name: 'experience', label: 'Experience (years)', type: 'number' }]} initialValues={editing ?? undefined} />
      <CrudModal title="Add comment" open={commenting} onClose={() => setCommenting(false)} onSubmit={(values) => state.createEntity('comments', { name: values.title, title: values.title, entityType: values.entityType as 'match' | 'tournament', entityId: values.entityId, author: values.author, message: values.message })} fields={[{ name: 'title', label: 'Title' }, { name: 'author', label: 'Author' }, { name: 'entityType', label: 'Entity type', type: 'select', options: [{ value: 'match', label: 'Match' }, { value: 'tournament', label: 'Tournament' }] }, { name: 'entityId', label: 'Entity ID' }, { name: 'message', label: 'Message', type: 'textarea' }]} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete commentator?" message="Only local broadcast talent data will be removed." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('commentators', deletingId); setDeletingId(null); }} />
      <ConfirmDialog open={Boolean(commentDeleteId)} title="Delete comment?" message="Commentary notes are stored only in browser state." onClose={() => setCommentDeleteId(null)} onConfirm={() => { if (commentDeleteId) state.deleteEntity('comments', commentDeleteId); setCommentDeleteId(null); }} />
    </>
  );
}

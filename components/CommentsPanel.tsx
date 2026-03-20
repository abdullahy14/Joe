'use client';

import { useState } from 'react';
import { useEsportsStore } from '@/store/useEsportsStore';

export function CommentsPanel({ entityType, entityId }: { entityType: 'match' | 'tournament' | 'commentator'; entityId: string }) {
  const comments = useEsportsStore((state) => state.comments.filter((comment) => comment.entityType === entityType && comment.entityId === entityId));
  const createComment = useEsportsStore((state) => state.createComment);
  const deleteComment = useEsportsStore((state) => state.deleteComment);
  const [author, setAuthor] = useState('Desk Admin');
  const [message, setMessage] = useState('');

  return (
    <section className="card">
      <div className="section-header">
        <h2>Comments</h2>
        <span className="muted">Linked to {entityType}</span>
      </div>
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          createComment({ name: `${entityType} comment`, entityType, entityId, author, message });
          setMessage('');
        }}
      >
        <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author" />
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add comment" />
        <button type="submit">Add</button>
      </form>
      <div className="stack-list">
        {comments.map((comment) => (
          <article key={comment.id} className="list-item">
            <div>
              <strong>{comment.author}</strong>
              <p className="muted">{comment.message}</p>
            </div>
            <button className="danger-button" onClick={() => deleteComment(comment.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

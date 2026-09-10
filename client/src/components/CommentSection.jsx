import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ comments, postId, onAddComment, onDeleteComment, loading }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await onAddComment(postId, content.trim());
    setContent('');
    setSubmitting(false);
  };

  return (
    <div className="comments-panel">
      <h3>Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            placeholder="Write a comment..."
          />
          <button type="submit" className="button primary" disabled={submitting || loading}>
            {submitting ? 'Posting...' : 'Submit Comment'}
          </button>
        </form>
      ) : (
        <p className="muted">Please log in to add a comment.</p>
      )}

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="muted">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          comments.map((comment) => (
            <div className="comment-item" key={comment._id}>
              <div className="comment-head">
                <strong>{comment.author?.name || 'User'}</strong>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
              {user && user.id === comment.author?._id && (
                <button
                  className="text-button"
                  onClick={() => onDeleteComment(comment._id)}
                  type="button"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

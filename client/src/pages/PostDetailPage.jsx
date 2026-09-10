import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load this post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete post.');
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      fetchPost();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchPost();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete comment.');
    }
  };

  if (loading) return <div className="loader">Loading post...</div>;
  if (error) return <div className="container section-space"><div className="alert error">{error}</div></div>;
  if (!post) return null;

  const isOwner = user && user.id === post.author?._id;
  const contentLines = post.content.split(/\r?\n/);

  return (
    <div className="container section-space post-detail">
      <div className="detail-card">
        <div className="detail-head">
          <div>
            <p className="eyebrow">{post.category || 'General'}</p>
            <h1>{post.title}</h1>
          </div>
          {isOwner ? (
            <div className="button-row compact">
              <Link className="button secondary" to={`/edit-post/${post._id}`}>Edit</Link>
              <button className="button danger" onClick={handleDelete}>Delete</button>
            </div>
          ) : null}
        </div>

        <div className="meta-row">
          <span>By {post.author?.name || 'Author'}</span>
          <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
          {post.updatedAt && post.updatedAt !== post.createdAt ? (
            <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
          ) : null}
        </div>

        <div className="post-body">
          {contentLines.map((line, lineIndex) => (
            <Fragment key={`${post._id}-line-${lineIndex}`}>
              {line}
              {lineIndex < contentLines.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </div>

        {post.tags && post.tags.length > 0 ? (
          <div className="tags-row">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        ) : null}
      </div>

      <CommentSection
        comments={post.comments || []}
        postId={post._id}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}

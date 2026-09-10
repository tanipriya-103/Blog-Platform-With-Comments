import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return;
      try {
        const response = await api.get('/posts');
        const filtered = (response.data.data || []).filter((post) => post.author?._id === user.id || post.author?.id === user.id || post.author === user.id);
        setPosts(filtered);
      } catch (err) {
        setError('Unable to load your posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  if (!user) return <div className="container section-space"><div className="alert error">Please log in to view your posts.</div></div>;

  return (
    <div className="container section-space">
      <div className="detail-card">
        <div className="detail-head">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>My Posts</h2>
          </div>
          <Link className="button primary" to="/create-post">Create Post</Link>
        </div>
      </div>

      {loading ? <div className="loader">Loading your posts...</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && posts.length === 0 ? (
        <div className="empty-state">
          <h3>You have no posts yet.</h3>
          <p>Publish your first story to start sharing.</p>
        </div>
      ) : null}

      <div className="posts-grid" style={{ marginTop: '24px' }}>
        {posts.map((post) => (
          <article className="post-card" key={post._id}>
            <div className="card-header">
              <span className="tag">{post.category || 'General'}</span>
              <span className="meta">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h3>{post.title}</h3>
            <p className="excerpt">{post.excerpt || post.content.slice(0, 128)}</p>
            <div className="card-footer">
              <Link className="button secondary small" to={`/posts/${post._id}`}>View</Link>
              <Link className="button primary small" to={`/edit-post/${post._id}`}>Edit</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

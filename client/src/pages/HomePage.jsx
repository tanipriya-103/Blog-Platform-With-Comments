import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data.data || []);
      setError('');
    } catch (error) {
      setError('Unable to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => {
      const values = [
        post.title,
        post.content,
        post.author?.name,
        post.category,
        ...(post.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return values.includes(query);
    });
  }, [posts, search]);

  return (
    <div className="container section-space">
      <div className="hero-box">
        <div>
          <p className="eyebrow">Fresh stories</p>
          <h1>Explore ideas, insights, and community stories</h1>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts, authors, or categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? <div className="loader">Loading posts...</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!loading && !error && filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No blog posts available yet.</h3>
          <p>Create the first post to start the conversation.</p>
        </div>
      ) : null}

      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

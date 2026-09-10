import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        const post = response.data.data;
        setForm({
          title: post.title,
          content: post.content,
          category: post.category || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await api.put(`/posts/${id}`, {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      navigate(`/posts/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading post...</div>;

  return (
    <div className="container form-page">
      <div className="form-card">
        <h2>Edit post</h2>
        {error ? <div className="alert error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="editor-form">
          <label>
            Title
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Category
            <input type="text" name="category" value={form.category} onChange={handleChange} />
          </label>

          <label>
            Tags
            <input type="text" name="tags" value={form.tags} onChange={handleChange} />
          </label>

          <label>
            Content
            <textarea rows="10" name="content" value={form.content} onChange={handleChange} required />
          </label>

          <div className="button-row">
            <button type="button" className="button secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/posts', {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      navigate(`/posts/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page">
      <div className="form-card">
        <h2>Create a new post</h2>
        {error ? <div className="alert error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="editor-form">
          <label>
            Title
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Category
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Technology" />
          </label>

          <label>
            Tags
            <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="react, tutorial, web" />
          </label>

          <label>
            Content
            <textarea rows="10" name="content" value={form.content} onChange={handleChange} required />
          </label>

          <div className="button-row">
            <button type="button" className="button secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const createdDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="post-card">
      <div className="card-header">
        <span className="tag">{post.category || 'General'}</span>
        <span className="meta">{createdDate}</span>
      </div>

      <h3>{post.title}</h3>
      <p className="excerpt">{post.excerpt || post.content.slice(0, 140)}</p>

      <div className="card-meta-row">
        <span>By {post.author?.name || 'Unknown'}</span>
        <span>{post.commentCount || 0} comments</span>
      </div>

      <div className="card-meta-row card-footer">
        {post.updatedAt && post.updatedAt !== post.createdAt ? (
          <small>Updated {new Date(post.updatedAt).toLocaleDateString()}</small>
        ) : (
          <small>Published</small>
        )}
        <Link className="button primary small" to={`/posts/${post._id}`}>
          Read more
        </Link>
      </div>
    </article>
  );
}

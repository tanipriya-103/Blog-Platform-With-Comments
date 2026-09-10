import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/api';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>
          BlogVerse
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          {user ? <Link to="/my-posts">My Posts</Link> : null}
          {user ? <Link to="/create-post">Create Post</Link> : null}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-pill">Hi, {user.name}</span>
              <button className="button secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="button secondary" to="/login">Login</Link>
              <Link className="button primary" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

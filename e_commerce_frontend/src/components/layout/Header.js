import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/**
 * PUBLIC_INTERFACE
 * Header renders the top navigation with brand, search, auth links, and cart button.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const { count, toggleCart } = useCart();
  const [q, setQ] = useState('');
  const [params] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    setQ(params.get('q') || '');
  }, [params]);

  const onSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(window.location.search);
    if (q) next.set('q', q); else next.delete('q');
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Home">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 13h2v8H3v-8Zm4-6h2v14H7V7Zm4 3h2v11h-2V10Zm4-6h2v17h-2V4Zm4 9h2v8h-2v-8Z" fill="currentColor"/>
          </svg>
          <span>ShopEasy</span>
        </Link>

        <form className="searchbar" onSubmit={onSearch} role="search" aria-label="Product search">
          <input
            type="search"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search query"
          />
          <button className="btn" type="submit">Search</button>
        </form>

        <div className="actions">
          {user ? (
            <>
              <Link to="/orders" className="icon-btn" aria-label="Orders">Orders</Link>
              <button className="icon-btn" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="icon-btn" aria-label="Login">Login</Link>
              <Link to="/register" className="icon-btn" aria-label="Register">Register</Link>
            </>
          )}
          <button className="btn accent" onClick={toggleCart} aria-label="Open cart">
            🛒 Cart ({count})
          </button>
        </div>
      </div>
    </header>
  );
}

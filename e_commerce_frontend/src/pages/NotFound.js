import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NotFound displays a simple 404 message with a link back home.
 */
export default function NotFound() {
  return (
    <div className="container center">
      <h2>Page not found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn">Go Home</Link>
    </div>
  );
}

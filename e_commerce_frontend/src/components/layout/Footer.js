import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Footer shows basic links and contact information.
 */
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div>
          <strong>ShopEasy</strong>
          <p className="muted">A modern, clean shopping experience.</p>
          <small>© {new Date().getFullYear()} ShopEasy Inc.</small>
        </div>
        <div>
          <strong>Links</strong>
          <div className="form" style={{marginTop: 8}}>
            <a href="/#about">About</a>
            <a href="/#help">Help Center</a>
            <a href="/#shipping">Shipping</a>
          </div>
        </div>
        <div>
          <strong>Contact</strong>
          <div className="form" style={{marginTop: 8}}>
            <a href="mailto:support@example.com">support@example.com</a>
            <span className="muted">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

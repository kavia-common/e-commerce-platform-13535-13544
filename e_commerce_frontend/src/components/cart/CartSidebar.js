import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * CartSidebar renders a slide-in panel with cart items and checkout button.
 */
export default function CartSidebar() {
  const { items, open, closeCart, remove, updateQty, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <aside className={`cart-sidebar ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="Shopping cart">
      <div className="cart-header">
        <strong>Cart</strong>
        <button className="icon-btn" onClick={closeCart} aria-label="Close">Close</button>
      </div>
      <div className="cart-items">
        {items.length === 0 && <div className="muted">Your cart is empty.</div>}
        {items.map(it => (
          <div className="cart-item" key={it.id}>
            <img src={it.image || 'https://via.placeholder.com/56'} alt={it.title} />
            <div>
              <div style={{fontWeight:600}}>{it.title}</div>
              <div className="muted">${it.price.toFixed(2)}</div>
              <div className="inline" style={{marginTop:6}}>
                <button className="icon-btn" onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} aria-label="Decrease quantity">-</button>
                <span aria-label="Quantity" style={{minWidth: 24, textAlign:'center'}}>{it.qty}</span>
                <button className="icon-btn" onClick={() => updateQty(it.id, it.qty + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button className="icon-btn" onClick={() => remove(it.id)} aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="inline" style={{ justifyContent: 'space-between' }}>
          <strong>Subtotal</strong>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        {items.length > 0 && (
          user ? (
            <button className="btn" onClick={goCheckout}>Proceed to Checkout</button>
          ) : (
            <Link to="/login" className="btn">Login to Checkout</Link>
          )
        )}
      </div>
    </aside>
  );
}

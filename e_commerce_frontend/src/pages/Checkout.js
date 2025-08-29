import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Checkout collects shipping and payment info and submits an order to the backend.
 */
export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { token, user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [card, setCard] = useState('');
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container">
        <div className="toast" role="alert">You must be logged in to checkout.</div>
        <Link className="btn" to="/login">Login</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (items.length === 0) {
      setErr('Your cart is empty.');
      return;
    }
    setProcessing(true);
    try {
      // Minimal payment simulation; in real app integrate provider using REACT_APP_PAYMENT_PUBLIC_KEY
      const payload = {
        items: items.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
        shipping: { name, address, city, zip },
        payment: { last4: card.slice(-4) },
        subtotal
      };
      const order = await api.createOrder(payload, token);
      clear();
      navigate('/orders', { state: { placed: order?.id || true } });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
      <div className="card">
        <h3>Shipping</h3>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" required value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" required value={address} onChange={e=>setAddress(e.target.value)} />
          </div>
          <div className="inline">
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="city">City</label>
              <input id="city" required value={city} onChange={e=>setCity(e.target.value)} />
            </div>
            <div className="field" style={{ width: 160 }}>
              <label htmlFor="zip">ZIP</label>
              <input id="zip" required value={zip} onChange={e=>setZip(e.target.value)} />
            </div>
          </div>
          <h3>Payment</h3>
          <div className="field">
            <label htmlFor="card">Card number (mock)</label>
            <input id="card" required value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
          </div>
          {err && <div className="toast" role="alert">{err}</div>}
          <button className="btn" type="submit" disabled={processing}>{processing ? 'Processing...' : 'Pay & Place Order'}</button>
        </form>
      </div>
      <div className="card">
        <h3>Order Summary</h3>
        <div className="form">
          {items.map(it => (
            <div key={it.id} className="inline" style={{ justifyContent: 'space-between' }}>
              <span>{it.title} × {it.qty}</span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="inline" style={{ justifyContent: 'space-between' }}>
            <strong>Subtotal</strong>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

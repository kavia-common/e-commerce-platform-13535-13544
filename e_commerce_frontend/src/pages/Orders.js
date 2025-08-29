import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Orders lists the authenticated user's past orders.
 */
export default function Orders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const location = useLocation();

  // Always call hooks; use effect can guard internally based on user/token
  React.useEffect(() => {
    let mounted = true;
    if (!token) {
      setOrders([]);
      return () => { mounted = false; };
    }
    setLoading(true);
    api.listOrders(token).then(data => {
      if (!mounted) return;
      setOrders(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
    }).catch(e => {
      if (!mounted) return;
      setErr(e.message);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [token]);

  if (!user) {
    return <Navigate to="/login" state={{ from: '/orders' }} replace />;
  }

  return (
    <div className="container">
      <div className="inline" style={{ justifyContent:'space-between' }}>
        <h2>Your Orders</h2>
        <Link to="/" className="icon-btn">Continue shopping</Link>
      </div>
      {location.state?.placed && <div className="toast" role="status">Order placed successfully!</div>}
      {loading && <div>Loading...</div>}
      {err && <div className="toast" role="alert">{err}</div>}

      <div className="form">
        {orders.map(o => (
          <div key={o.id || o.createdAt} className="card">
            <div className="inline" style={{ justifyContent:'space-between' }}>
              <strong>Order #{o.id || '—'}</strong>
              <span className="muted">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</span>
            </div>
            <div className="form">
              {(o.items || []).map((it, idx) => (
                <div key={idx} className="inline" style={{ justifyContent:'space-between' }}>
                  <span>{it.title || it.id} × {it.qty}</span>
                  <span>${Number((it.price || 0) * (it.qty || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="right">
              <strong>Total: ${Number(o.total || o.subtotal || 0).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>

      {!loading && orders.length === 0 && <div className="muted">No orders yet.</div>}
    </div>
  );
}

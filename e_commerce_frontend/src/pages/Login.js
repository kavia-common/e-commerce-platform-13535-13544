import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login page authenticates the user and redirects back to previous location or home.
 */
export default function Login() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || '/';

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await login(email, password);
    if (res.ok) navigate(from, { replace: true });
    else setErr(res.message || 'Login failed');
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pwd">Password</label>
          <input id="pwd" type="password" required value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div className="toast" role="alert">{err}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  );
}

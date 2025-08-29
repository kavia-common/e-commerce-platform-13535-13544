import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Register page creates an account and logs user in.
 */
export default function Register() {
  const { user, register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await register(name, email, password);
    if (res.ok) navigate('/', { replace: true });
    else setErr(res.message || 'Registration failed');
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2>Create Account</h2>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" required value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pwd">Password</label>
          <input id="pwd" type="password" required value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div className="toast" role="alert">{err}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  );
}

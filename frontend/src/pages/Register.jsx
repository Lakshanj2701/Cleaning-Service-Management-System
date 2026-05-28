import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useUser();
  const navigate  = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name     = 'Full name is required.';
    if (!form.email.trim())              e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password)                  e.password = 'Password is required.';
    else if (form.password.length < 6)   e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm)  e.confirm  = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const res = await axios.post(`${API}/auth/register`, {
        name: form.name, email: form.email, password: form.password,
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-sm ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    }`;

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">✨</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-3">Create an Account</h1>
            <p className="text-slate-500 text-sm mt-1">Join SparkleClean to book and manage your cleans</p>
          </div>

          {apiError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              ❌ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set('name')}
                className={inputCls('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={set('email')}
                className={inputCls('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={set('password')}
                className={inputCls('password')}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={set('confirm')}
                className={inputCls('confirm')}
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

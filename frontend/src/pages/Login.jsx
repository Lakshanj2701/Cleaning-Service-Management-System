import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useUser();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from || '/';

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required.';
    if (!form.password)        e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-sm ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    }`;

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">👤</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-3">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your SparkleClean account</p>
          </div>

          {apiError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              ❌ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                className={inputCls('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-medium text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={inputCls('password')}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

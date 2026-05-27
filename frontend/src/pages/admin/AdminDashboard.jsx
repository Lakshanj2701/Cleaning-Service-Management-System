import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/admin/login'); return; }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (id) => {
    setActionLoading(id + '_complete');
    try {
      await axios.patch(`${API}/admin/bookings/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBookings();
    } finally {
      setActionLoading('');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    setActionLoading(id + '_delete');
    try {
      await axios.delete(`${API}/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBookings();
    } finally {
      setActionLoading('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pending   = bookings.filter((b) => b.status === 'pending').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧹</span>
          <div>
            <h1 className="font-bold text-lg leading-none">SparkleClean</h1>
            <p className="text-slate-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">All Bookings</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ['Total', bookings.length, 'bg-slate-800', 'text-white'],
            ['Pending', pending, 'bg-yellow-400', 'text-yellow-900'],
            ['Completed', completed, 'bg-emerald-500', 'text-white'],
          ].map(([label, count, bg, text]) => (
            <div key={label} className={`${bg} ${text} rounded-2xl p-5 text-center shadow-sm`}>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <span className="text-5xl block mb-4">📋</span>
            <p className="text-xl font-medium">No bookings yet</p>
            <p className="text-sm">New bookings will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800 text-slate-200 text-left">
                    {['Customer', 'Service', 'Date', 'Time', 'Phone', 'Address', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr
                      key={b._id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{b.name}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {b.service?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.date}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.time}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.phone}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate" title={b.address}>
                        {b.address}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => markComplete(b._id)}
                              disabled={actionLoading === b._id + '_complete'}
                              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {actionLoading === b._id + '_complete' ? '...' : '✓ Complete'}
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(b._id)}
                            disabled={actionLoading === b._id + '_delete'}
                            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {actionLoading === b._id + '_delete' ? '...' : '🗑 Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

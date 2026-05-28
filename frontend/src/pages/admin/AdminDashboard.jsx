import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const EMPTY_SERVICE = { name: '', description: '', price: '', image: '', category: 'residential' };
const CATEGORIES = ['residential', 'commercial', 'furniture'];

// ─── Reusable spinner ────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-24">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Service form (add or edit) ───────────────────────────────────────────────
function ServiceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Name is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
                                  e.price       = 'Valid price is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, price: Number(form.price) });
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })); },
  });

  const inputCls = (key) =>
    `w-full border rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${
      errors[key] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        {initial._id ? '✏️ Edit Service' : '➕ Add New Service'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Service Name</label>
          <input type="text" placeholder="e.g. Deep Clean" className={inputCls('name')} {...field('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Price ($)</label>
          <input type="number" placeholder="e.g. 120" min="1" className={inputCls('price')} {...field('price')} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-slate-600 text-sm font-medium mb-1">Description</label>
          <textarea rows={2} placeholder="Brief service description…" className={inputCls('description')} {...field('description')} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Image URL <span className="text-slate-400">(optional)</span></label>
          <input type="url" placeholder="https://images.unsplash.com/…" className={inputCls('image')} {...field('image')} />
        </div>

        {/* Category */}
        <div>
          <label className="block text-slate-600 text-sm font-medium mb-1">Category</label>
          <select className={inputCls('category')} {...field('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
        >
          {saving ? 'Saving…' : initial._id ? 'Update Service' : 'Add Service'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('bookings'); // 'bookings' | 'services' | 'users'

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingAction, setBookingAction] = useState('');

  // Users state
  const [users, setUsers]             = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userAction, setUserAction]   = useState('');
  const [userMsg, setUserMsg]         = useState({ type: '', text: '' });

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // service being edited
  const [formSaving, setFormSaving] = useState(false);
  const [serviceAction, setServiceAction] = useState('');
  const [serviceMsg, setServiceMsg] = useState({ type: '', text: '' });

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!isAuthenticated) { navigate('/admin/login'); return; }
    fetchBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    if (tab === 'services' && services.length === 0) fetchServices();
    if (tab === 'users'    && users.length === 0)    fetchUsers();
  }, [tab]);

  // ── Bookings ────────────────────────────────────────────────────────────────
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get(`${API}/admin/bookings`, { headers: authHeader });
      setBookings(res.data);
    } catch {
      navigate('/admin/login');
    } finally {
      setBookingsLoading(false);
    }
  };

  const markComplete = async (id) => {
    setBookingAction(id + '_complete');
    try {
      await axios.patch(`${API}/admin/bookings/${id}`, {}, { headers: authHeader });
      await fetchBookings();
    } finally { setBookingAction(''); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    setBookingAction(id + '_delete');
    try {
      await axios.delete(`${API}/admin/bookings/${id}`, { headers: authHeader });
      await fetchBookings();
    } finally { setBookingAction(''); }
  };

  // ── Users ───────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API}/admin/users`, { headers: authHeader });
      setUsers(res.data);
    } finally { setUsersLoading(false); }
  };

  const flashUser = (type, text) => {
    setUserMsg({ type, text });
    setTimeout(() => setUserMsg({ type: '', text: '' }), 3500);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    setUserAction(id);
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers: authHeader });
      flashUser('success', 'User deleted successfully.');
      await fetchUsers();
    } catch {
      flashUser('error', 'Failed to delete user.');
    } finally { setUserAction(''); }
  };

  // ── Services ────────────────────────────────────────────────────────────────
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await axios.get(`${API}/admin/services`, { headers: authHeader });
      setServices(res.data);
    } finally { setServicesLoading(false); }
  };

  const flash = (type, text) => {
    setServiceMsg({ type, text });
    setTimeout(() => setServiceMsg({ type: '', text: '' }), 3500);
  };

  const handleSaveService = async (data) => {
    setFormSaving(true);
    try {
      if (editTarget) {
        await axios.put(`${API}/admin/services/${editTarget._id}`, data, { headers: authHeader });
        flash('success', 'Service updated successfully.');
      } else {
        await axios.post(`${API}/admin/services`, data, { headers: authHeader });
        flash('success', 'Service added successfully.');
      }
      setShowForm(false);
      setEditTarget(null);
      await fetchServices();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to save service.');
    } finally { setFormSaving(false); }
  };

  const handleEditService = (service) => {
    setEditTarget(service);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    setServiceAction(id);
    try {
      await axios.delete(`${API}/admin/services/${id}`, { headers: authHeader });
      flash('success', 'Service deleted.');
      await fetchServices();
    } catch {
      flash('error', 'Failed to delete service.');
    } finally { setServiceAction(''); }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const pending   = bookings.filter((b) => b.status === 'pending').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[
            { key: 'bookings', label: '📋 Bookings', count: bookings.length },
            { key: 'services', label: '🧹 Services', count: services.length },
            { key: 'users',    label: '👥 Users',    count: users.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-colors border-b-2 -mb-px ${
                tab === key
                  ? 'border-emerald-500 text-emerald-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                  tab === key ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                ['Total', bookings.length, 'bg-slate-800 text-white'],
                ['Pending', pending, 'bg-yellow-400 text-yellow-900'],
                ['Completed', completed, 'bg-emerald-500 text-white'],
              ].map(([label, count, cls]) => (
                <div key={label} className={`${cls} rounded-2xl p-5 text-center shadow-sm`}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
                </div>
              ))}
            </div>

            {bookingsLoading ? <Spinner /> : bookings.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <span className="text-5xl block mb-4">📋</span>
                <p className="text-xl font-medium">No bookings yet</p>
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
                        <tr key={b._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{b.name}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.service?.name || '—'}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.date}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.time}</td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.phone}</td>
                          <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate" title={b.address}>{b.address}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {b.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex gap-2">
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => markComplete(b._id)}
                                  disabled={bookingAction === b._id + '_complete'}
                                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {bookingAction === b._id + '_complete' ? '…' : '✓ Complete'}
                                </button>
                              )}
                              <button
                                onClick={() => deleteBooking(b._id)}
                                disabled={bookingAction === b._id + '_delete'}
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {bookingAction === b._id + '_delete' ? '…' : '🗑 Delete'}
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
          </>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <>
            {userMsg.text && (
              <div className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium border ${
                userMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {userMsg.type === 'success' ? '✅' : '❌'} {userMsg.text}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Registered Users</h2>
                <p className="text-slate-500 text-sm">{users.length} account{users.length !== 1 ? 's' : ''} registered</p>
              </div>
              <div className="bg-blue-100 text-blue-700 font-bold text-2xl px-6 py-3 rounded-2xl text-center">
                {users.length}
                <p className="text-xs font-medium mt-0.5 opacity-70">Total Users</p>
              </div>
            </div>

            {usersLoading ? <Spinner /> : users.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <span className="text-5xl block mb-4">👥</span>
                <p className="text-xl font-medium">No registered users yet</p>
                <p className="text-sm">Users who sign up will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200 text-left">
                        {['#', 'Name', 'Email', 'Registered', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-800">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{u.email}</td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={userAction === u._id}
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {userAction === u._id ? '…' : '🗑 Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── SERVICES TAB ── */}
        {tab === 'services' && (
          <>
            {/* Flash message */}
            {serviceMsg.text && (
              <div className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium border ${
                serviceMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {serviceMsg.type === 'success' ? '✅' : '❌'} {serviceMsg.text}
              </div>
            )}

            {/* Add service button / form toggle */}
            {!showForm && (
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">All Services</h2>
                  <p className="text-slate-500 text-sm">{services.length} service{services.length !== 1 ? 's' : ''} in database</p>
                </div>
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true); }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  ➕ Add New Service
                </button>
              </div>
            )}

            {/* Add / Edit form */}
            {showForm && (
              <ServiceForm
                initial={editTarget ? { ...editTarget, price: String(editTarget.price) } : EMPTY_SERVICE}
                onSave={handleSaveService}
                onCancel={() => { setShowForm(false); setEditTarget(null); }}
                saving={formSaving}
              />
            )}

            {/* Services list */}
            {servicesLoading ? <Spinner /> : services.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <span className="text-5xl block mb-4">🧹</span>
                <p className="text-xl font-medium">No services yet</p>
                <p className="text-sm">Click "Add New Service" to get started.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200 text-left">
                        {['Image', 'Name', 'Description', 'Price', 'Category', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={s._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-4 py-3">
                            {s.image ? (
                              <img
                                src={s.image}
                                alt={s.name}
                                className="w-14 h-10 object-cover rounded-lg"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">🧹</div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{s.name}</td>
                          <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate" title={s.description}>{s.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full">${s.price}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full capitalize">{s.category}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditService(s)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(s._id)}
                                disabled={serviceAction === s._id}
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {serviceAction === s._id ? '…' : '🗑 Delete'}
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
          </>
        )}
      </div>
    </div>
  );
}

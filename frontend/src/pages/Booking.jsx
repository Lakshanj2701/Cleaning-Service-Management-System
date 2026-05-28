import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const today = new Date().toISOString().split('T')[0];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('serviceId');

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', service: '', date: '', time: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(''); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API}/services`).then((res) => {
      setServices(res.data);
      if (preselectedId) setForm((f) => ({ ...f, service: preselectedId }));
    });
  }, [preselectedId]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required.';
    if (!form.phone.trim())   e.phone   = 'Phone number is required.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.service)        e.service = 'Please select a service.';
    if (!form.date)           e.date    = 'Date is required.';
    if (!form.time)           e.time    = 'Time is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setStatus('');
    try {
      await axios.post(`${API}/bookings`, form);
      setStatus('success');
      setForm({ name: '', phone: '', address: '', service: preselectedId || '', date: '', time: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
    }`;

  return (
    <div className="pt-16">
      {/* Page hero */}
      <div className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Cleaning Service</h1>
        <p className="text-slate-400 text-lg">Fill in your details and we'll confirm your booking shortly.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === 'success' && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Booking confirmed!</p>
                <p className="text-sm">We will contact you soon to confirm your appointment.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              ❌ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                className={inputClass('phone')}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main Street, Colombo 07"
                rows={3}
                className={inputClass('address')}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Service */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Select Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={inputClass('service')}
              >
                <option value="">-- Choose a service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  className={inputClass('date')}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={inputClass('time')}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg transition-colors mt-2"
            >
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

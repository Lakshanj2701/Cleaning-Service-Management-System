import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/services`)
      .then((res) => setServices(res.data))
      .catch(() => setError('Failed to load services. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16">
      {/* Page hero */}
      <div className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">All Cleaning Services</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Browse our full range of professional cleaning packages — priced for every budget.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={s.image || FALLBACK_IMG}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                    <span className="bg-emerald-100 text-emerald-600 font-bold text-sm px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      ${s.price}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{s.description}</p>
                  <button
                    onClick={() => navigate(`/booking?serviceId=${s._id}`)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

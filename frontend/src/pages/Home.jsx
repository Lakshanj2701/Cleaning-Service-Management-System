import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/services`)
      .then((res) => setServices(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center text-white px-4">
        <div className="text-center max-w-3xl animate-fade-in">
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
            🌟 Sri Lanka's #1 Cleaning Service
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Sparkle<span className="text-emerald-400">Clean</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
            Spotless Homes, Stress-Free Life
          </p>
          <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Professional cleaning services for your home and office. Trusted by 2,000+ happy customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/booking')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              Book Now →
            </button>
            <Link
              to="/services"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Our Services
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[['2000+', 'Happy Clients'], ['10+', 'Years Experience'], ['100%', 'Satisfaction']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{val}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">About Us</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2 mb-6">
              Why Choose SparkleClean?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              We deliver professional-grade cleaning using eco-friendly products and trained staff.
              Every clean is backed by our 100% satisfaction guarantee — if you're not happy, we come back for free.
            </p>
            <ul className="space-y-4">
              {[
                ['✅', '10+ Years Experience', 'Trusted by thousands of households across Sri Lanka'],
                ['🌿', 'Eco-Friendly Products', 'Safe for your family, pets, and the environment'],
                ['👷', 'Trained Professionals', 'Background-checked, uniformed, and fully insured staff'],
                ['💯', '100% Satisfaction Guarantee', 'Not satisfied? We return and re-clean at no charge'],
              ].map(([icon, title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{title}</p>
                    <p className="text-slate-500 text-sm">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
              alt="Professional cleaning"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">Our Popular Services</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              From deep cleans to express sofa washes — we have every cleaning need covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s._id} className="rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4">🧹</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{s.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-500 font-bold text-lg">${s.price}</span>
                  <Link
                    to={`/booking?serviceId=${s._id}`}
                    className="text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-block bg-slate-900 hover:bg-slate-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-emerald-500 py-16 px-4 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Spotless Home?</h2>
        <p className="text-emerald-100 mb-8 text-lg">Book online in under 2 minutes. No commitment required.</p>
        <button
          onClick={() => navigate('/booking')}
          className="bg-white text-emerald-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-emerald-50 transition-colors shadow-lg"
        >
          Get Started Today
        </button>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧹</span>
            <span className="text-white font-bold text-xl">SparkleClean</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Spotless Homes, Stress-Free Life
          </p>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Professional cleaning services you can trust. Serving Sri Lanka since 2014.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/services' },
              { label: 'Gallery', to: '/gallery' },
              { label: 'Book Now', to: '/booking' },
              { label: 'Contact', to: '/contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-emerald-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>45 Flower Road, Colombo 07, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <span>info@sparkleclean.lk</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>+94 77 123 4567</span>
            </li>
          </ul>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <span>💬</span> WhatsApp Us
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} SparkleClean. All rights reserved.
      </div>
    </footer>
  );
}

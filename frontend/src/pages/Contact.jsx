import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="pt-16">
      {/* Page hero */}
      <div className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
        <p className="text-slate-400 text-lg">We'd love to hear from you. Reach out any time.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT — Contact info */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>

          <ul className="space-y-5 mb-8">
            {[
              ['📍', 'Address', '45 Flower Road, Colombo 07, Sri Lanka'],
              ['✉️', 'Email', 'info@sparkleclean.lk'],
              ['📞', 'Phone', '+94 77 123 4567'],
            ].map(([icon, label, value]) => (
              <li key={label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">{label}</p>
                  <p className="text-slate-800 font-semibold">{value}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors mb-8"
          >
            💬 Chat on WhatsApp
          </a>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="SparkleClean Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d79.8567!3d6.9103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596b1b3b3b3b%3A0x1b2b3b4b5b6b7b8b!2sColombo+07%2C+Sri+Lanka!5e0!3m2!1sen!2slk!4v1620000000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT — Contact form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Us a Message</h2>

          {sent && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">
              ✅ Thank you! We will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="John Doe"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="john@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                placeholder="How can we help you?"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

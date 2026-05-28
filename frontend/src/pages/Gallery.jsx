const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=500', alt: 'Cleaned living room' },
  { src: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=500', alt: 'Kitchen cleaning' },
  { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500', alt: 'Carpet cleaning' },
  { src: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500', alt: 'Window cleaning' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', alt: 'Kitchen sanitizing' },
  { src: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=500', alt: 'Office cleaning' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Deep cleaning' },
  { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500', alt: 'Modern clean home' },
];

const REVIEWS = [
  {
    name: 'Sarah Fernando',
    stars: 5,
    text: 'Absolutely outstanding service! My apartment has never been this clean. The team was punctual, professional, and thorough. Highly recommended!',
    location: 'Colombo 05',
  },
  {
    name: 'Raj Peiris',
    stars: 5,
    text: 'Booked the office cleaning package and was blown away by the results. The team arrived on time and finished ahead of schedule. Will definitely use again.',
    location: 'Kandy',
  },
  {
    name: 'Amara Silva',
    stars: 5,
    text: 'The deep clean before our move-in was perfect. Every corner was spotless. Worth every rupee — this is the best cleaning service in Sri Lanka!',
    location: 'Nugegoda',
  },
];

export default function Gallery() {
  return (
    <div className="pt-16">
      {/* Page hero */}
      <div className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
        <p className="text-slate-400 text-lg">See the difference we make — one clean at a time.</p>
      </div>

      {/* Image grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {IMAGES.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md group">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-slate-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6">
                <div className="text-yellow-400 text-xl mb-3">{'★'.repeat(r.stars)}</div>
                <p className="text-slate-600 leading-relaxed mb-4 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    <p className="text-slate-400 text-xs">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

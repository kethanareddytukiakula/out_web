import { useState } from "react";
import { Search, Star, Users, MapPin, Coffee, Utensils, BookOpen, ShoppingBag, Music, Trees, Zap, Navigation, X } from "lucide-react";

const categories = [
  { label: "All", icon: Zap, grad: "from-[#f72585] to-[#7209b7]" },
  { label: "Cafés", icon: Coffee, grad: "from-[#ff6b35] to-[#f72585]" },
  { label: "Food", icon: Utensils, grad: "from-[#f72585] to-[#c026d3]" },
  { label: "Study", icon: BookOpen, grad: "from-[#06d6a0] to-[#4cc9f0]" },
  { label: "Malls", icon: ShoppingBag, grad: "from-[#7209b7] to-[#c026d3]" },
  { label: "Parks", icon: Trees, grad: "from-[#06d6a0] to-[#4361ee]" },
  { label: "Fun", icon: Music, grad: "from-[#f72585] to-[#ff6b35]" },
];

const hotspots = [
  { id: 1, name: "Brew & Bean Café", category: "Cafés", rating: 4.8, crowd: "Moderate", crowdPct: 55, distance: "0.4 km", reviews: 234, trending: true, hidden: false, tags: ["WiFi", "Quiet", "AC"], image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&auto=format", desc: "Popular among students for its strong coffee and fast WiFi. Great for study sessions.", popularity: 92, grad: "from-[#ff6b35] to-[#f72585]" },
  { id: 2, name: "The Study Loft", category: "Study", rating: 4.6, crowd: "Low", crowdPct: 25, distance: "0.7 km", reviews: 189, trending: false, hidden: true, tags: ["Silent", "Outlets", "AC"], image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop&auto=format", desc: "Hidden gem — a three-floor library-style café with dedicated study pods.", popularity: 78, grad: "from-[#06d6a0] to-[#4cc9f0]" },
  { id: 3, name: "Campus Bites", category: "Food", rating: 4.5, crowd: "High", crowdPct: 85, distance: "0.2 km", reviews: 512, trending: true, hidden: false, tags: ["Budget", "Fast", "Veg"], image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop&auto=format", desc: "Most visited food joint near campus. Known for quick bites and student-friendly prices.", popularity: 97, grad: "from-[#f72585] to-[#c026d3]" },
  { id: 4, name: "Metro Mall", category: "Malls", rating: 4.3, crowd: "High", crowdPct: 78, distance: "1.2 km", reviews: 890, trending: true, hidden: false, tags: ["Shopping", "Food Court", "Movies"], image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=200&fit=crop&auto=format", desc: "The go-to weekend destination with over 200 stores, cinema, and a massive food court.", popularity: 88, grad: "from-[#7209b7] to-[#c026d3]" },
  { id: 5, name: "Green Valley Park", category: "Parks", rating: 4.7, crowd: "Low", crowdPct: 20, distance: "0.9 km", reviews: 145, trending: false, hidden: true, tags: ["Outdoor", "Quiet", "Free"], image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format", desc: "A serene park with jogging tracks and shaded benches. Perfect for a quiet afternoon.", popularity: 65, grad: "from-[#06d6a0] to-[#4361ee]" },
  { id: 6, name: "CineMax IMAX", category: "Fun", rating: 4.4, crowd: "Moderate", crowdPct: 60, distance: "1.5 km", reviews: 320, trending: false, hidden: false, tags: ["Movies", "IMAX", "AC"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=200&fit=crop&auto=format", desc: "Best IMAX experience in the area. Student discounts available on weekdays.", popularity: 82, grad: "from-[#f72585] to-[#ff6b35]" },
];

const mapAreas = [
  { label: "Library", x: 20, y: 25, level: "low", students: 12 },
  { label: "Canteen", x: 55, y: 40, level: "high", students: 87 },
  { label: "Main Gate", x: 75, y: 60, level: "moderate", students: 34 },
  { label: "Sports Field", x: 35, y: 65, level: "moderate", students: 28 },
  { label: "Hostels", x: 15, y: 75, level: "low", students: 9 },
  { label: "Auditorium", x: 65, y: 20, level: "high", students: 62 },
];

const crowdStyle = (level: string) => {
  if (level === "Low" || level === "low") return { bg: "rgba(6,214,160,0.15)", text: "#06d6a0", dot: "#06d6a0", glow: "rgba(6,214,160,0.4)" };
  if (level === "Moderate" || level === "moderate") return { bg: "rgba(255,214,10,0.15)", text: "#ffd60a", dot: "#ffd60a", glow: "rgba(255,214,10,0.4)" };
  return { bg: "rgba(247,37,133,0.2)", text: "#f72585", dot: "#f72585", glow: "rgba(247,37,133,0.5)" };
};

type View = "hotspots" | "map";

export function ExploreScreen() {
  const [view, setView] = useState<View>("hotspots");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<typeof hotspots[0] | null>(null);

  const filtered = hotspots.filter(h => {
    const matchCat = activeCategory === "All" || h.category === activeCategory;
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image} alt={selected.name} className="w-full h-52 object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,22,42,0.8) 0%, transparent 50%)' }} />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <X size={14} className="text-white" />
              </button>
              <div className="absolute bottom-3 left-4 flex gap-2">
                {selected.trending && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', color: 'white', fontWeight: 700 }}>🔥 Trending</span>}
                {selected.hidden && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'linear-gradient(135deg, #7209b7, #4361ee)', color: 'white', fontWeight: 700 }}>💎 Hidden Gem</span>}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{selected.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>{selected.distance} away · {selected.reviews} reviews</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,214,10,0.15)' }}>
                  <Star size={12} className="text-[#ffd60a] fill-[#ffd60a]" />
                  <span className="text-sm" style={{ color: '#ffd60a', fontWeight: 800 }}>{selected.rating}</span>
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: '#8888aa', lineHeight: 1.6 }}>{selected.desc}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {selected.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>{t}</span>)}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-xs mb-1" style={{ color: '#8888aa' }}>Crowd</p>
                  <span className="text-sm px-2 py-0.5 rounded-full" style={{ ...crowdStyle(selected.crowd), fontWeight: 700 }}>{selected.crowd}</span>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-xs mb-1" style={{ color: '#8888aa' }}>Popularity</p>
                  <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{selected.popularity}/100</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-white hover:opacity-90 transition-all" style={{ background: `linear-gradient(135deg, ${selected.grad.replace('from-[', '').replace(']', '').split(' to-')[0]}, ${selected.grad.split(' to-[')[1]?.replace(']', '')})`, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                <Navigation size={15} /> Get Directions
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>Explore 🗺️</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888aa' }} />
            <input type="text" placeholder="Search places..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl text-sm text-white outline-none w-44"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {(["hotspots", "map"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-sm capitalize transition-all"
                style={view === v ? { background: 'linear-gradient(135deg, #f72585, #7209b7)', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 } : { color: '#8888aa' }}>
                {v === "hotspots" ? "🏪 List" : "🗺 Map"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map(cat => {
          const active = activeCategory === cat.label;
          return (
            <button key={cat.label} onClick={() => setActiveCategory(cat.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:scale-105"
              style={active ? { background: `linear-gradient(135deg, var(--from), var(--to))`, color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 } : { background: 'rgba(255,255,255,0.06)', color: '#8888aa' }}
            >
              {active ? (
                <div className={`flex items-center gap-1.5`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br ${cat.grad}`}>
                    <cat.icon size={11} className="text-white" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white' }}>{cat.label}</span>
                </div>
              ) : (
                <><cat.icon size={13} />{cat.label}</>
              )}
            </button>
          );
        })}
      </div>

      {view === "hotspots" ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(place => {
            const cs = crowdStyle(place.crowd);
            return (
              <button key={place.id} onClick={() => setSelected(place)} className="rounded-2xl overflow-hidden text-left hover:scale-[1.02] transition-all group" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,22,42,0.7) 0%, transparent 50%)' }} />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    {place.trending && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontWeight: 700 }}>🔥</span>}
                    {place.hidden && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #7209b7, #4361ee)', fontWeight: 700 }}>💎</span>}
                  </div>
                  <div className="absolute bottom-2 left-3 flex items-center gap-1">
                    <Star size={11} className="text-[#ffd60a] fill-[#ffd60a]" />
                    <span className="text-xs text-white" style={{ fontWeight: 700 }}>{place.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-white mb-1 truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{place.name}</p>
                  <p className="text-xs mb-2" style={{ color: '#8888aa' }}>{place.distance} · {place.reviews} reviews</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cs.bg, color: cs.text, fontWeight: 700 }}>{place.crowd}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${place.popularity}%`, background: `linear-gradient(90deg, #f72585, #7209b7)` }} />
                      </div>
                      <span className="text-[10px]" style={{ color: '#8888aa' }}>{place.popularity}%</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative h-96" style={{ background: 'linear-gradient(135deg, #0d0a2e, #0a1a2e)' }}>
              <div className="absolute inset-0 opacity-10">
                {[20, 40, 60, 80].map(p => <div key={`h${p}`} className="absolute left-0 right-0 h-px bg-white" style={{ top: `${p}%` }} />)}
                {[25, 50, 75].map(p => <div key={`v${p}`} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${p}%` }} />)}
              </div>
              <div className="absolute rounded-full" style={{ width: 150, height: 150, left: '48%', top: '30%', filter: 'blur(35px)', background: 'rgba(247,37,133,0.35)' }} />
              <div className="absolute rounded-full" style={{ width: 110, height: 110, left: '60%', top: '10%', filter: 'blur(28px)', background: 'rgba(247,37,133,0.25)' }} />
              <div className="absolute rounded-full" style={{ width: 100, height: 100, left: '70%', top: '52%', filter: 'blur(25px)', background: 'rgba(255,214,10,0.2)' }} />
              <div className="absolute rounded-full" style={{ width: 80, height: 80, left: '8%', top: '65%', filter: 'blur(20px)', background: 'rgba(6,214,160,0.25)' }} />
              {mapAreas.map(area => {
                const cs = crowdStyle(area.level);
                return (
                  <div key={area.label} className="absolute flex flex-col items-center" style={{ left: `${area.x}%`, top: `${area.y}%`, transform: 'translate(-50%, -100%)' }}>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mb-1 whitespace-nowrap shadow-lg" style={{ background: 'rgba(13,13,26,0.85)', color: cs.text, fontWeight: 700, border: `1px solid ${cs.dot}33` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: cs.dot, boxShadow: `0 0 4px ${cs.glow}` }} />
                      {area.label}
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: cs.dot, boxShadow: `0 0 6px ${cs.glow}` }} />
                  </div>
                );
              })}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs text-white" style={{ background: 'rgba(13,13,26,0.8)', fontFamily: 'var(--font-display)', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>📍 Campus Area</div>
              <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Navigation size={16} style={{ color: '#c026d3' }} />
              </div>
            </div>
            <div className="flex items-center gap-6 px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {["low", "moderate", "high"].map(level => {
                const cs = crowdStyle(level);
                const l = { low: "Low Crowd", moderate: "Moderate", high: "Highly Crowded" };
                return (
                  <div key={level} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: cs.dot, boxShadow: `0 0 4px ${cs.glow}` }} />
                    <span className="text-xs" style={{ color: '#8888aa', fontWeight: 500 }}>{l[level as keyof typeof l]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm">⚡</span>
              <p className="text-sm text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Live Density</p>
            </div>
            {mapAreas.map((area, i) => {
              const cs = crowdStyle(area.level);
              return (
                <div key={area.label} className="flex items-center gap-3 px-4 py-3" style={i < mapAreas.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cs.bg }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: cs.dot, boxShadow: `0 0 4px ${cs.glow}` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate" style={{ fontWeight: 600 }}>{area.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Users size={9} style={{ color: '#8888aa' }} />
                      <span className="text-[10px]" style={{ color: '#8888aa' }}>{area.students}</span>
                    </div>
                  </div>
                  <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${area.students}%`, background: cs.dot }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

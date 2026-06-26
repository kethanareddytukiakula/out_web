import { useState } from "react";
import { Search, Star, Users, MapPin, Coffee, Utensils, BookOpen, ShoppingBag, Music, Trees, Zap, Navigation, X } from "lucide-react";
import { places, type Place } from "../../data/places";

const categories = [
  { label: "All", icon: Zap, grad: "from-[#f72585] to-[#7209b7]" },
  { label: "Cafés", icon: Coffee, grad: "from-[#ff6b35] to-[#f72585]" },
  { label: "Food", icon: Utensils, grad: "from-[#f72585] to-[#c026d3]" },
  { label: "Study", icon: BookOpen, grad: "from-[#06d6a0] to-[#4cc9f0]" },
  { label: "Malls", icon: ShoppingBag, grad: "from-[#7209b7] to-[#c026d3]" },
  { label: "Parks", icon: Trees, grad: "from-[#06d6a0] to-[#4361ee]" },
  { label: "Fun", icon: Music, grad: "from-[#f72585] to-[#ff6b35]" },
];

const placeCategoryLabel = (cat: Place["category"]): string => {
  if (cat === "Cafe") return "Cafés";
  if (cat === "Food") return "Food";
  return "Fun";
};

const placeGrad = (cat: Place["category"]): string => {
  if (cat === "Cafe") return "from-[#ff6b35] to-[#f72585]";
  if (cat === "Food") return "from-[#f72585] to-[#c026d3]";
  return "from-[#f72585] to-[#ff6b35]";
};

type HotspotCard = {
  id: string;
  name: string;
  category: string;
  rating: number;
  crowd: string;
  crowdPct: number;
  distance: string;
  reviews: number;
  trending: boolean;
  hidden: boolean;
  tags: string[];
  image: string;
  desc: string;
  popularity: number;
  grad: string;
};

const hotspots: HotspotCard[] = places.map((p, idx) => ({
  id: p.id,
  name: p.name,
  category: placeCategoryLabel(p.category),
  rating: p.rating,
  crowd: idx % 3 === 0 ? "Low" : idx % 3 === 1 ? "Moderate" : "High",
  crowdPct: idx % 3 === 0 ? 25 : idx % 3 === 1 ? 55 : 85,
  distance: p.distance,
  reviews: 100 + idx * 37,
  trending: idx % 2 === 0,
  hidden: idx % 2 === 1,
  tags: p.tags ?? [],
  image: p.image ?? "",
  desc: p.description,
  popularity: 60 + ((p.rating * 10) | 0) % 35,
  grad: placeGrad(p.category),
}));

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
  const [selected, setSelected] = useState<HotspotCard | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const categoryAliases: Record<string, Place["category"]> = {
    cafe: "Cafe", cafes: "Cafe", café: "Cafe", cafés: "Cafe", coffee: "Cafe", hookah: "Cafe", shisha: "Cafe",
    food: "Food", restaurant: "Food", restaurants: "Food", biryani: "Food", nonveg: "Food", veg: "Food",
    fun: "Fun", tourist: "Fun", tourism: "Fun", sightseeing: "Fun", heritage: "Fun", temple: "Fun", fort: "Fun",
  };

  const isAffordable = (p: Place) => p.budget > 0 && p.budget <= 200;
  const isFree = (p: Place) => p.budget === 0;

  const matchSearch = (h: HotspotCard, p: Place): boolean => {
    if (!normalizedQuery) return true;
    const aliasCategory = categoryAliases[normalizedQuery];
    if (aliasCategory && p.category === aliasCategory) return true;
    if (normalizedQuery === "budget" || normalizedQuery === "cheap" || normalizedQuery === "affordable") {
      return isAffordable(p) || isFree(p);
    }
    if (normalizedQuery === "free") return isFree(p);
    const haystacks = [
      h.name.toLowerCase(),
      p.category.toLowerCase(),
      p.description.toLowerCase(),
      h.category.toLowerCase(),
      ...(p.tags ?? []).map(t => t.toLowerCase()),
    ];
    return haystacks.some(text => text.includes(normalizedQuery));
  };

  const filtered = hotspots.filter(h => {
    const matchCat = activeCategory === "All" || h.category === activeCategory;
    const matchHit = matchSearch(h, places.find(p => p.id === h.id)!);
    return matchCat && matchHit;
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
        <div className="space-y-7">
          {([
            { key: "Fun" as Place["category"], emoji: "🏛", title: "Fun & Tourist Places" },
            { key: "Food" as Place["category"], emoji: "🍽", title: "Food" },
            { key: "Cafe" as Place["category"], emoji: "☕", title: "Cafés" },
          ]).map(section => {
            const sectionPlaces = filtered.filter(h => places.find(p => p.id === h.id)?.category === section.key);
            if (sectionPlaces.length === 0) return null;
            return (
              <div key={section.key}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{section.emoji}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: '#f0f0ff', letterSpacing: '-0.01em' }}>{section.title}</h3>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(247,37,133,0.35), rgba(114,9,183,0.1), transparent)' }} />
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', fontWeight: 700 }}>{sectionPlaces.length} spots</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {sectionPlaces.map(place => {
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
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-2xl flex flex-col items-center justify-center text-center py-16 px-6" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px rgba(247,37,133,0.08)' }}>
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(247,37,133,0.25) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(247,37,133,0.15), rgba(114,9,183,0.15))', border: '1px solid rgba(247,37,133,0.3)' }}>
                  <Search size={32} style={{ color: '#f72585' }} />
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#f0f0ff', letterSpacing: '-0.01em' }}>No places found</h3>
              <p className="text-sm mt-2 max-w-md" style={{ color: '#8888aa', lineHeight: 1.6 }}>
                We couldn't find anything matching <span style={{ color: '#f72585', fontWeight: 700 }}>"{searchQuery}"</span>. Try a different keyword or browse all categories.
              </p>
              <button onClick={() => setSearchQuery("")} className="mt-6 px-5 py-2.5 rounded-xl text-sm text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                Clear search
              </button>
            </div>
          )}
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

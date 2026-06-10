import { MapPin, TrendingUp, Users, Zap, Coffee, ShoppingBag, Utensils, BookOpen, ChevronRight, Star, Clock, DollarSign, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", spend: 120 }, { day: "Tue", spend: 280 }, { day: "Wed", spend: 0 },
  { day: "Thu", spend: 450 }, { day: "Fri", spend: 680 }, { day: "Sat", spend: 920 },
  { day: "Sun", spend: 380 },
];

const trendingPlaces = [
  { name: "Brew & Bean", category: "Café", rating: 4.8, crowd: "Moderate", distance: "0.4 km", icon: Coffee, color: "from-[#f72585] to-[#c026d3]" },
  { name: "Study Loft", category: "Study", rating: 4.6, crowd: "Low", distance: "0.7 km", icon: BookOpen, color: "from-[#4361ee] to-[#4cc9f0]" },
  { name: "Campus Bites", category: "Food", rating: 4.5, crowd: "High", distance: "0.2 km", icon: Utensils, color: "from-[#ff6b35] to-[#f72585]" },
  { name: "Metro Mall", category: "Mall", rating: 4.3, crowd: "High", distance: "1.2 km", icon: ShoppingBag, color: "from-[#7209b7] to-[#c026d3]" },
];

const friendActivity = [
  { name: "Priya M.", action: "checked in at", place: "Brew & Bean", time: "12m", avatar: "PM", grad: "from-[#f72585] to-[#c026d3]" },
  { name: "Rahul K.", action: "ended outing", place: "Metro Mall", time: "34m", avatar: "RK", grad: "from-[#4361ee] to-[#4cc9f0]" },
  { name: "Dev P.", action: "reviewed", place: "Campus Bites", time: "1h", avatar: "DP", grad: "from-[#ff6b35] to-[#f72585]" },
  { name: "Aisha K.", action: "posted in", place: "Community", time: "2h", avatar: "AK", grad: "from-[#06d6a0] to-[#4cc9f0]" },
];

const crowdBadge = (c: string) => {
  if (c === "Low") return { bg: "rgba(6,214,160,0.15)", text: "#06d6a0" };
  if (c === "Moderate") return { bg: "rgba(255,193,7,0.15)", text: "#ffd60a" };
  return { bg: "rgba(247,37,133,0.15)", text: "#f72585" };
};

interface HomeScreenProps { onNavigate: (tab: string) => void; onStartOuting: () => void; }

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div style={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 12px', fontSize: 12 }}>
    <p style={{ color: '#8888aa' }}>{label}</p>
    <p style={{ color: '#f72585', fontWeight: 700 }}>₹{payload[0].value}</p>
  </div>
) : null;

export function HomeScreen({ onNavigate, onStartOuting }: HomeScreenProps) {
  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm mb-1" style={{ color: '#8888aa' }}>Good afternoon ☀️  Tuesday, Jun 9</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: '#f0f0ff', letterSpacing: '-0.02em' }}>
            Hey Arjun, what's the{" "}
            <span style={{ background: 'linear-gradient(90deg, #f72585, #c026d3, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              vibe today? 🔥
            </span>
          </h1>
        </div>
        <button onClick={onStartOuting} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800, boxShadow: '0 4px 20px rgba(247,37,133,0.4)' }}>
          <Zap size={15} fill="white" /> Start Outing
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "This Week", value: "5", sub: "outings", icon: Activity, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
          { label: "Hours Outside", value: "14.5h", sub: "total", icon: Clock, grad: "from-[#7209b7] to-[#4361ee]", glow: "rgba(114,9,183,0.2)" },
          { label: "Spent", value: "₹2,830", sub: "this week", icon: DollarSign, grad: "from-[#4cc9f0] to-[#06d6a0]", glow: "rgba(76,201,240,0.2)" },
          { label: "Places", value: "8", sub: "visited", icon: MapPin, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: `0 4px 24px ${s.glow}` }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${s.glow.replace('0.2', '1')} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.grad} mb-3`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl text-white leading-none mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{s.value}</p>
            <p className="text-xs" style={{ color: '#8888aa' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Hero CTA */}
        <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 100%)', border: '1px solid rgba(247,37,133,0.2)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(247,37,133,0.12) 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#06d6a0]" />
              <span className="text-xs" style={{ color: '#8888aa' }}>No active outing</span>
            </div>
            <p className="text-sm mb-5" style={{ color: '#8888aa' }}>Ready to explore? Start tracking and discover new spots.</p>
            <div className="space-y-2">
              <button onClick={onStartOuting} className="w-full py-2.5 rounded-xl text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                <Zap size={14} fill="white" /> Start Outing
              </button>
              <button onClick={() => onNavigate("explore")} className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ background: 'rgba(255,255,255,0.06)', color: '#a78bfa', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                <MapPin size={14} /> Explore Places
              </button>
            </div>
          </div>
        </div>

        {/* Spending chart */}
        <div className="lg:col-span-2 md:col-span-1 col-span-1 rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Weekly Spending 💸</p>
              <p className="text-xs" style={{ color: '#8888aa' }}>Mon–Sun this week</p>
            </div>
            <div className="text-right">
              <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹2,830</p>
              <p className="text-xs text-[#06d6a0]">↓ 12% vs last week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyData} barSize={28}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f72585" />
                  <stop offset="100%" stopColor="#7209b7" />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8888aa' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spend" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Trending */}
        <div className="col-span-2 rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Trending Nearby</p>
            </div>
            <button onClick={() => onNavigate("explore")} className="flex items-center gap-1 text-xs" style={{ color: '#c026d3', fontWeight: 700 }}>
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trendingPlaces.map(p => {
              const badge = crowdBadge(p.crowd);
              return (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${p.color}`}>
                    <p.icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star size={10} className="text-[#ffd60a] fill-[#ffd60a]" />
                        <span className="text-xs" style={{ color: '#ffd60a', fontWeight: 700 }}>{p.rating}</span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text, fontWeight: 600 }}>{p.crowd}</span>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: '#8888aa' }}>{p.distance}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Friend activity */}
        <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base">👥</span>
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Friends</p>
            </div>
            <button onClick={() => onNavigate("community")} className="text-xs" style={{ color: '#c026d3', fontWeight: 700 }}>See all</button>
          </div>
          <div className="space-y-3">
            {friendActivity.map(f => (
              <div key={f.name} className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] text-white flex-shrink-0 bg-gradient-to-br ${f.grad}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {f.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white leading-snug">
                    <span style={{ fontWeight: 700 }}>{f.name}</span>{" "}
                    <span style={{ color: '#8888aa' }}>{f.action}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#c026d3', fontWeight: 600 }}>{f.place}</p>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: '#8888aa' }}>{f.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

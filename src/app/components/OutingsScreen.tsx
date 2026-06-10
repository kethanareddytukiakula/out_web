import { useState, useEffect } from "react";
import { Play, Square, Clock, MapPin, DollarSign, Tag, Search, Filter, Utensils, ShoppingBag, Coffee, BookOpen, Music, AlertCircle, X, Activity, Zap } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils, Travel: MapPin, Shopping: ShoppingBag, Entertainment: Music, Study: BookOpen, Other: Tag,
};
const categoryGrads: Record<string, string> = {
  Food: "from-[#ff6b35] to-[#f72585]", Travel: "from-[#4361ee] to-[#4cc9f0]",
  Shopping: "from-[#7209b7] to-[#c026d3]", Entertainment: "from-[#f72585] to-[#c026d3]",
  Study: "from-[#06d6a0] to-[#4cc9f0]", Other: "from-[#8888aa] to-[#4361ee]",
};
const categoryTagColor: Record<string, { bg: string; text: string }> = {
  Food: { bg: "rgba(255,107,53,0.15)", text: "#ff6b35" },
  Travel: { bg: "rgba(67,97,238,0.15)", text: "#4cc9f0" },
  Shopping: { bg: "rgba(114,9,183,0.15)", text: "#c026d3" },
  Entertainment: { bg: "rgba(247,37,133,0.15)", text: "#f72585" },
  Study: { bg: "rgba(6,214,160,0.15)", text: "#06d6a0" },
  Other: { bg: "rgba(136,136,170,0.15)", text: "#8888aa" },
};

const outingHistory = [
  { id: 1, date: "Today", startTime: "10:30 AM", endTime: "1:15 PM", duration: "2h 45m", amount: 380, category: "Food", location: "Campus Bites & Brew" },
  { id: 2, date: "Yesterday", startTime: "3:00 PM", endTime: "6:45 PM", duration: "3h 45m", amount: 520, category: "Shopping", location: "Metro Mall" },
  { id: 3, date: "Yesterday", startTime: "9:00 AM", endTime: "11:30 AM", duration: "2h 30m", amount: 0, category: "Study", location: "Central Library" },
  { id: 4, date: "Jun 7", startTime: "5:00 PM", endTime: "9:00 PM", duration: "4h 00m", amount: 1200, category: "Entertainment", location: "CineMax IMAX" },
  { id: 5, date: "Jun 6", startTime: "11:00 AM", endTime: "2:00 PM", duration: "3h 00m", amount: 450, category: "Food", location: "Street Food Hub" },
  { id: 6, date: "Jun 5", startTime: "6:30 PM", endTime: "8:00 PM", duration: "1h 30m", amount: 200, category: "Travel", location: "City Park" },
  { id: 7, date: "Jun 4", startTime: "2:00 PM", endTime: "5:30 PM", duration: "3h 30m", amount: 660, category: "Shopping", location: "Central Square" },
  { id: 8, date: "Jun 3", startTime: "7:00 PM", endTime: "10:00 PM", duration: "3h 00m", amount: 400, category: "Entertainment", location: "Bowling Alley" },
];

const filters = ["All Time", "Today", "This Week", "This Month"];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function SummaryModal({ elapsed, onSave, onSkip }: { elapsed: number; onSave: (a: number, c: string) => void; onSkip: () => void }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const categories = ["Food", "Travel", "Shopping", "Entertainment", "Study", "Other"];
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(247,37,133,0.2)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>Outing Done! 🎉</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>How did it go?</p>
          </div>
          <button onClick={onSkip} className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={14} className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[{ label: "Duration", val: formatTime(elapsed) }, { label: "Location", val: "Campus Area" }].map(i => (
            <div key={i.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs mb-1" style={{ color: '#8888aa' }}>{i.label}</p>
              <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{i.val}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-xs mb-2 block" style={{ color: '#8888aa', fontWeight: 600 }}>AMOUNT SPENT (₹)</label>
          <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-white text-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-display)', fontWeight: 900 }} />
        </div>
        <div className="mb-6">
          <label className="text-xs mb-2 block" style={{ color: '#8888aa', fontWeight: 600 }}>CATEGORY</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => {
              const Icon = categoryIcons[c] || Tag;
              const active = category === c;
              const grad = categoryGrads[c];
              return (
                <button key={c} onClick={() => setCategory(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${active ? `bg-gradient-to-r ${grad} text-white` : 'text-white/60 hover:text-white'}`}
                  style={!active ? { background: 'rgba(255,255,255,0.06)' } : { fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  <Icon size={12} />{c}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', fontWeight: 600 }}>Skip</button>
          <button onClick={() => onSave(Number(amount) || 0, category)} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Save ✨</button>
        </div>
      </div>
    </div>
  );
}

interface OutingsScreenProps {
  isOutingActive: boolean; outingStart: Date | null;
  onStartOuting: () => void; onEndOuting: (amount: number, category: string) => void;
}

export function OutingsScreen({ isOutingActive, outingStart, onStartOuting, onEndOuting }: OutingsScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [history, setHistory] = useState(outingHistory);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOutingActive && outingStart) {
      interval = setInterval(() => setElapsed(Math.floor((Date.now() - outingStart.getTime()) / 1000)), 1000);
    }
    return () => clearInterval(interval);
  }, [isOutingActive, outingStart]);

  const handleSave = (amount: number, category: string) => {
    setHistory(prev => [{ id: Date.now(), date: "Today", startTime: "Now", endTime: "Just now", duration: formatTime(elapsed), amount, category, location: "Campus Area" }, ...prev]);
    setShowSummary(false);
    onEndOuting(amount, category);
  };

  const filtered = history.filter(o =>
    o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = filtered.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      {showSummary && <SummaryModal elapsed={elapsed} onSave={handleSave} onSkip={() => { setShowSummary(false); onEndOuting(0, "Other"); }} />}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Tracker */}
        <div className="space-y-4">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>Outing Tracker 🚀</h2>

          {isOutingActive ? (
            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a2e1a, #0a1a2e)', border: '1px solid rgba(6,214,160,0.3)', boxShadow: '0 4px 24px rgba(6,214,160,0.15)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(6,214,160,0.08) 0%, transparent 60%)' }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#06d6a0] animate-pulse" />
                  <span className="text-sm text-[#06d6a0]" style={{ fontWeight: 700 }}>Live Outing</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(6,214,160,0.15)', color: '#06d6a0', fontWeight: 700 }}>LIVE</span>
                </div>
                <p className="text-white mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, letterSpacing: '0.04em' }}>{formatTime(elapsed)}</p>
                <p className="text-xs mb-4" style={{ color: '#8888aa' }}>Started {outingStart?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm" style={{ background: 'rgba(255,107,53,0.1)', color: '#ff6b35' }}>
                  <AlertCircle size={13} />
                  <span style={{ fontWeight: 600 }}>Curfew in {22 - new Date().getHours()}h</span>
                </div>
                <button onClick={() => setShowSummary(true)} className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm" style={{ background: 'rgba(6,214,160,0.15)', color: '#06d6a0', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  <Square size={14} fill="#06d6a0" /> End Outing
                </button>
              </div>
            </div>
          ) : (
            <button onClick={onStartOuting} className="w-full rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #1a0530, #0d0d1a)', border: '1px solid rgba(247,37,133,0.3)', boxShadow: '0 4px 24px rgba(247,37,133,0.15)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)' }}>
                <Play size={26} className="text-white ml-1" fill="white" />
              </div>
              <div className="text-left">
                <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18 }}>Start Outing</p>
                <p className="text-xs" style={{ color: '#8888aa' }}>Tap to begin tracking 🔥</p>
              </div>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Outings", value: history.length, icon: Activity, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
              { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: DollarSign, grad: "from-[#06d6a0] to-[#4cc9f0]", glow: "rgba(6,214,160,0.2)" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: `0 4px 16px ${s.glow}` }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.grad} mb-2`}>
                  <s.icon size={16} className="text-white" />
                </div>
                <p className="text-white text-xl leading-none mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{s.value}</p>
                <p className="text-xs" style={{ color: '#8888aa' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-white mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Recent 📍</p>
            {history.slice(0, 3).map(o => {
              const Icon = categoryIcons[o.category] || Tag;
              const grad = categoryGrads[o.category];
              return (
                <div key={o.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${grad}`}>
                    <Icon size={13} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate" style={{ fontWeight: 600 }}>{o.location}</p>
                    <p className="text-[10px]" style={{ color: '#8888aa' }}>{o.date} · {o.duration}</p>
                  </div>
                  <p className="text-xs text-white" style={{ fontWeight: 800 }}>{o.amount > 0 ? `₹${o.amount}` : "Free"}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: History table */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>History 📋</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888aa' }} />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl text-sm text-white outline-none w-40"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }} />
              </div>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Filter size={13} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-xl text-sm transition-all"
                style={activeFilter === f ? { background: 'linear-gradient(135deg, #f72585, #7209b7)', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 } : { background: 'rgba(255,255,255,0.06)', color: '#8888aa', fontWeight: 500 }}>
                {f}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid gap-4 px-5 py-3 sm:px-4 sm:py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', gridTemplateColumns: 'minmax(180px,2fr) 90px 90px 120px 110px 90px' }}>
              {["Location", "Date", "Time", "Duration", "Category", "Amount"].map(h => (
                <p key={h} className="text-xs uppercase" style={{ color: '#8888aa', fontWeight: 700, letterSpacing: '0.06em' }}>{h}</p>
              ))}
            </div>
            {filtered.map((o, i) => {
              const Icon = categoryIcons[o.category] || Tag;
              const grad = categoryGrads[o.category];
              const tag = categoryTagColor[o.category] || { bg: "rgba(136,136,170,0.15)", text: "#8888aa" };
              return (
                <div key={o.id} className="grid gap-4 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ gridTemplateColumns: 'minmax(180px,2fr) 90px 90px 120px 110px 90px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${grad}`}>
                      <Icon size={12} className="text-white" />
                    </div>
                    <p className="text-sm text-white whitespace-normal break-words" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, minWidth: 180, maxWidth: 420 }}>{o.location}</p>
                  </div>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{o.date}</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{o.startTime}</p>
                  <div className="flex items-center gap-1">
                    <Clock size={11} style={{ color: '#8888aa' }} />
                    <p className="text-xs text-white" style={{ fontWeight: 600 }}>{o.duration}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full w-fit" style={{ background: tag.bg, color: tag.text, fontWeight: 700 }}>{o.category}</span>
                  <p className="text-sm text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                    {o.amount > 0 ? `₹${o.amount}` : <span style={{ color: '#06d6a0' }}>Free</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

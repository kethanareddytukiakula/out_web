import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Clock, DollarSign, MapPin, TrendingUp, ChevronRight, Settings, Shield, Bell, HelpCircle, LogOut, Zap, Camera } from "lucide-react";
import { getOutingsForUser, type OutingDocument } from "../../services/outingService";
import { getExpensesForUser, type ExpenseDocument } from "../../services/expenseService";

type Tab = "profile";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const { currentUser, logout, loading } = useAuth();
  const [outings, setOutings] = useState<OutingDocument[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDocument[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.uid) return;
      try {
        const oDocs = await getOutingsForUser(currentUser.uid);
        setOutings(oDocs);
        const eDocs = await getExpensesForUser(currentUser.uid);
        setExpenses(eDocs);
      } catch (err) {
        console.error("Failed to load profile screen stats:", err);
      }
    };
    loadStats();
  }, [currentUser?.uid]);

  const completedOutings = outings.filter(o => o.status === "completed");
  const totalOutings = completedOutings.length;
  const placesVisited = new Set(completedOutings.map(o => o.location.trim()).filter(Boolean)).size;
  const totalDurationSeconds = completedOutings.reduce((sum, o) => sum + (o.duration || 0), 0);
  const totalHours = (totalDurationSeconds / 3600).toFixed(0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Favorite category calculation
  const categoryCounts: Record<string, number> = {};
  completedOutings.forEach(o => {
    categoryCounts[o.category] = (categoryCounts[o.category] || 0) + 1;
  });
  let favoriteCategory = "None";
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      favoriteCategory = cat;
    }
  });

  // Favorite hotspot calculation
  const locationCounts: Record<string, number> = {};
  completedOutings.forEach(o => {
    if (o.location) {
      locationCounts[o.location] = (locationCounts[o.location] || 0) + 1;
    }
  });
  let favoriteHotspot = "None";
  let maxLocCount = 0;
  Object.entries(locationCounts).forEach(([loc, count]) => {
    if (count > maxLocCount) {
      maxLocCount = count;
      favoriteHotspot = loc;
    }
  });

  const categoryEmojis: Record<string, string> = {
    Food: "🍜 Food", Travel: "🚗 Travel", Shopping: "🛍️ Shopping", Entertainment: "🎵 Fun", Study: "📚 Study", Other: "🏷️ Other"
  };
  const favCatDisplay = favoriteCategory !== "None" ? (categoryEmojis[favoriteCategory] || `🏷️ ${favoriteCategory}`) : "None";

  const achievements = [
    { title: "Explorer", desc: "Visited 10+ places", icon: "🧭", earned: placesVisited >= 10 },
    { title: "Foodie", desc: "5+ food outings", icon: "🍜", earned: completedOutings.filter(o => o.category === "Food").length >= 5 },
    { title: "Budget Master", desc: "Spent < ₹500 total", icon: "💰", earned: totalSpent > 0 && totalSpent < 500 },
    { title: "Social Explorer", desc: "10 community posts", icon: "🤝", earned: true },
    { title: "Night Owl", desc: "Outing after 9 PM", icon: "🦉", earned: completedOutings.some(o => o.startTime.toDate().getHours() >= 21) },
    { title: "Early Bird", desc: "Outing before 8 AM", icon: "🌅", earned: completedOutings.some(o => o.startTime.toDate().getHours() < 8) },
  ];

  const tabGrads: Record<Tab, string> = {
    profile: "from-[#f72585] to-[#c026d3]",
  };

  const userInitials = loading ? '...' : (currentUser ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'AS');
  const userCourseYear = loading ? 'Loading...' : (currentUser ? `${currentUser.regNo} · ${currentUser.course}, ${currentUser.year}` : '21CSE045 · CSE, 3rd Year');

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>My Profile ⚡</h2>
      </div>

      {tab === "profile" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-4">
            <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0530, #0d0d1a)', border: '1px solid rgba(247,37,133,0.2)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(247,37,133,0.1) 0%, transparent 60%)' }} />
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl text-white mx-auto" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                  {userInitials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c026d3, #7209b7)', border: '2px solid #0d0d1a' }}>
                  <Camera size={11} className="text-white" />
                </button>
              </div>
              <h3 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{loading ? 'Loading...' : (currentUser?.name ?? 'User')}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>{userCourseYear}</p>
              <p className="text-xs mt-1" style={{ color: '#c026d3', fontWeight: 600 }}>{loading ? 'Loading...' : (currentUser?.email ?? 'arjun.singh@university.edu')}</p>
              <div className="flex justify-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { v: `${totalOutings}`, l: "Outings" },
                  { v: `${placesVisited}`, l: "Places" },
                  { v: `${totalHours}h`, l: "Hours" }
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15 }}>{s.v}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8888aa' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs mb-3" style={{ color: '#8888aa', fontWeight: 700, letterSpacing: '0.06em' }}>FAVOURITES</p>
              {[
                { l: "Category", v: favCatDisplay },
                { l: "Hotspot", v: favoriteHotspot }
              ].map(f => (
                <div key={f.l} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs" style={{ color: '#8888aa' }}>{f.l}</span>
                  <span className="text-xs text-white" style={{ fontWeight: 700 }}>{f.v}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[{ icon: Bell, label: "Notifications", color: "#4cc9f0" }, { icon: Shield, label: "Privacy & Safety", color: "#06d6a0" }, { icon: HelpCircle, label: "Help & Support", color: "#ffd60a" }, { icon: Settings, label: "Settings", color: "#8888aa" }].map((item, i) => (
                <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors" style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : {}}>
                  <item.icon size={14} style={{ color: item.color }} />
                  <span className="flex-1 text-sm text-white" style={{ fontWeight: 500 }}>{item.label}</span>
                  <ChevronRight size={12} style={{ color: '#8888aa' }} />
                </button>
              ))}
              <button onClick={async () => { try { await logout(); navigate("/login", { replace: true }); } catch (err) { console.error(err); } }} className="w-full flex items-center gap-3 px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <LogOut size={14} style={{ color: '#f72585' }} />
                <span className="text-sm" style={{ color: '#f72585', fontWeight: 600 }}>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Outings", value: `${totalOutings}`, icon: Activity, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
                { label: "Total Hours", value: `${totalHours}h`, icon: Clock, grad: "from-[#7209b7] to-[#4361ee]", glow: "rgba(114,9,183,0.2)" },
                { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: DollarSign, grad: "from-[#06d6a0] to-[#4cc9f0]", glow: "rgba(6,214,160,0.2)" },
                { label: "Places", value: `${placesVisited}`, icon: MapPin, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
              ].map(k => (
                <div key={k.label} className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: `0 4px 16px ${k.glow}` }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${k.grad} mb-2`}>
                    <k.icon size={16} className="text-white" />
                  </div>
                  <p className="text-white text-xl leading-none mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{k.value}</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{k.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Achievements 🏆</p>
              <div className="grid grid-cols-6 gap-3">
                {achievements.map(a => (
                  <div key={a.title} className={`rounded-2xl p-3 flex flex-col items-center text-center transition-all ${a.earned ? 'hover:scale-105' : 'opacity-30'}`}
                    style={{ background: a.earned ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', border: a.earned ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <p className="text-xs text-white leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{a.title}</p>
                    {a.earned && <div className="w-3 h-3 rounded-full bg-[#06d6a0] flex items-center justify-center mt-1.5"><div className="w-1 h-1 bg-white rounded-full" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

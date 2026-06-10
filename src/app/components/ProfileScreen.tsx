import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Clock, DollarSign, MapPin, TrendingUp, ChevronRight, Settings, Shield, Bell, HelpCircle, LogOut, Zap, Camera } from "lucide-react";

const spendingByCategory = [
  { name: "Food", value: 3200, color: "#f72585" },
  { name: "Shopping", value: 2100, color: "#7209b7" },
  { name: "Travel", value: 800, color: "#4cc9f0" },
  { name: "Fun", value: 1500, color: "#ff6b35" },
  { name: "Study", value: 200, color: "#06d6a0" },
];

const weeklySpend = [
  { day: "Mon", amount: 120 }, { day: "Tue", amount: 280 }, { day: "Wed", amount: 0 },
  { day: "Thu", amount: 450 }, { day: "Fri", amount: 680 }, { day: "Sat", amount: 920 },
  { day: "Sun", amount: 380 },
];

const monthlyOutings = [
  { month: "Jan", count: 8 }, { month: "Feb", count: 12 }, { month: "Mar", count: 10 },
  { month: "Apr", count: 15 }, { month: "May", count: 18 }, { month: "Jun", count: 7 },
];

const achievements = [
  { title: "Explorer", desc: "Visited 10+ places", icon: "🧭", earned: true },
  { title: "Foodie", desc: "50+ food outings", icon: "🍜", earned: true },
  { title: "Budget Master", desc: "Spent < ₹500/week", icon: "💰", earned: false },
  { title: "Social Explorer", desc: "10 community posts", icon: "🤝", earned: true },
  { title: "Night Owl", desc: "Late outing streak", icon: "🦉", earned: false },
  { title: "Early Bird", desc: "5 morning outings", icon: "🌅", earned: true },
];

type Tab = "profile" | "analytics" | "safety";

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div style={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
    <p style={{ color: '#8888aa' }}>{label}</p>
    <p style={{ color: '#f72585', fontWeight: 800 }}>₹{payload[0].value}</p>
  </div>
) : null;

export function ProfileScreen() {
  const [tab, setTab] = useState<Tab>("profile");
  const [safetyOn, setSafetyOn] = useState(false);
  const [sosPressed, setSosPressed] = useState(false);

  const tabGrads: Record<Tab, string> = {
    profile: "from-[#f72585] to-[#c026d3]",
    analytics: "from-[#7209b7] to-[#4361ee]",
    safety: "from-[#ff6b35] to-[#f72585]",
  };

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>My Profile ⚡</h2>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {(["profile", "analytics", "safety"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm capitalize transition-all"
              style={tab === t ? { background: `linear-gradient(135deg, var(--from), var(--to))`, color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800 } : { color: '#8888aa' }}>
              {tab === t ? (
                <span className={`bg-gradient-to-r ${tabGrads[t]} bg-clip-text`} style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              ) : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-4">
            <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0530, #0d0d1a)', border: '1px solid rgba(247,37,133,0.2)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(247,37,133,0.1) 0%, transparent 60%)' }} />
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl text-white mx-auto" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>AS</div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c026d3, #7209b7)', border: '2px solid #0d0d1a' }}>
                  <Camera size={11} className="text-white" />
                </button>
              </div>
              <h3 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>Arjun Singh</h3>
              <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>21CSE045 · CSE, 3rd Year</p>
              <p className="text-xs mt-1" style={{ color: '#c026d3', fontWeight: 600 }}>arjun.singh@university.edu</p>
              <div className="flex justify-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[{ v: "47", l: "Outings" }, { v: "23", l: "Places" }, { v: "128h", l: "Hours" }].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15 }}>{s.v}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8888aa' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs mb-3" style={{ color: '#8888aa', fontWeight: 700, letterSpacing: '0.06em' }}>FAVOURITES</p>
              {[{ l: "Category", v: "🍜 Food" }, { l: "Hotspot", v: "☕ Brew & Bean" }].map(f => (
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
              <button className="w-full flex items-center gap-3 px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <LogOut size={14} style={{ color: '#f72585' }} />
                <span className="text-sm" style={{ color: '#f72585', fontWeight: 600 }}>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Outings", value: "47", icon: Activity, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
                { label: "Total Hours", value: "128h", icon: Clock, grad: "from-[#7209b7] to-[#4361ee]", glow: "rgba(114,9,183,0.2)" },
                { label: "Total Spent", value: "₹7,800", icon: DollarSign, grad: "from-[#06d6a0] to-[#4cc9f0]", glow: "rgba(6,214,160,0.2)" },
                { label: "Places", value: "23", icon: MapPin, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
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

      {tab === "analytics" && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Avg Duration", value: "2h 43m", icon: Clock, grad: "from-[#4361ee] to-[#4cc9f0]", glow: "rgba(67,97,238,0.2)" },
              { label: "Longest Outing", value: "5h 20m", icon: Zap, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
              { label: "Avg Spend/Outing", value: "₹166", icon: DollarSign, grad: "from-[#06d6a0] to-[#4cc9f0]", glow: "rgba(6,214,160,0.2)" },
              { label: "Best Day", value: "Saturday", icon: TrendingUp, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
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

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Weekly Spending 💸</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>This week</p>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹2,830</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklySpend} barSize={32}>
                  <defs>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f72585" />
                      <stop offset="100%" stopColor="#7209b7" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8888aa' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="url(#barGrad2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Spend by Category 🥧</p>
              <div className="flex justify-center mb-3">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                      {spendingByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {spendingByCategory.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 4px ${cat.color}` }} />
                      <span className="text-xs" style={{ color: '#8888aa' }}>{cat.name}</span>
                    </div>
                    <span className="text-xs text-white" style={{ fontWeight: 700 }}>₹{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Monthly Outing Frequency 📈</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={monthlyOutings}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f72585" />
                    <stop offset="100%" stopColor="#4cc9f0" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8888aa' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 4, fill: '#f72585', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "safety" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="space-y-4">
            <div className="rounded-2xl p-6 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a0a0a, #0d0d1a)', border: '1px solid rgba(255,77,77,0.2)', boxShadow: '0 4px 24px rgba(255,77,77,0.1)' }}>
              <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Emergency SOS 🆘</p>
              <button
                onMouseDown={() => setSosPressed(true)} onMouseUp={() => setSosPressed(false)} onMouseLeave={() => setSosPressed(false)}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all mb-3 ${sosPressed ? 'scale-90' : 'scale-100 hover:scale-105'}`}
                style={{ background: 'linear-gradient(135deg, #ff4d4d, #c00)', boxShadow: sosPressed ? '0 0 0 16px rgba(255,77,77,0.25)' : '0 0 0 8px rgba(255,77,77,0.12)' }}>
                <span className="text-3xl">🆘</span>
                <span className="text-white text-sm mt-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>SOS</span>
              </button>
              <p className="text-xs text-center" style={{ color: '#8888aa' }}>Hold to alert contacts & campus security</p>
            </div>

            <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,214,160,0.15)' }}>
                    <MapPin size={15} style={{ color: '#06d6a0' }} />
                  </div>
                  <div>
                    <p className="text-sm text-white" style={{ fontWeight: 600 }}>Live Location</p>
                    <p className="text-xs" style={{ color: safetyOn ? '#06d6a0' : '#8888aa' }}>{safetyOn ? "Sharing with 3 contacts ✓" : "Off"}</p>
                  </div>
                </div>
                <button onClick={() => setSafetyOn(p => !p)}
                  className="w-11 h-6 rounded-full relative transition-colors"
                  style={{ background: safetyOn ? '#06d6a0' : 'rgba(255,255,255,0.1)' }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all" style={{ left: safetyOn ? 26 : 4 }} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Safe Routes 🗺️</p>
            {[
              { name: "Campus → Metro Mall", status: "Safe", time: "12 min" },
              { name: "Campus → City Park", status: "Safe", time: "8 min" },
              { name: "Late Night Route A", status: "Caution", time: "15 min" },
              { name: "Campus → Hostel", status: "Safe", time: "5 min" },
            ].map(r => (
              <div key={r.name} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <p className="text-sm text-white" style={{ fontWeight: 500 }}>{r.name}</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{r.time} walk</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={r.status === "Safe" ? { background: 'rgba(6,214,160,0.15)', color: '#06d6a0', fontWeight: 700 } : { background: 'rgba(255,214,10,0.15)', color: '#ffd60a', fontWeight: 700 }}>
                  {r.status === "Safe" ? "✓ Safe" : "⚠ Caution"}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Emergency Contacts 📞</p>
              <button className="text-xs" style={{ color: '#c026d3', fontWeight: 700 }}>+ Add</button>
            </div>
            {[
              { name: "Mom", phone: "+91 98765 43210", av: "M", grad: "from-[#f72585] to-[#c026d3]" },
              { name: "Dad", phone: "+91 98765 43211", av: "D", grad: "from-[#7209b7] to-[#4361ee]" },
              { name: "Campus Security", phone: "1800-CAM-SAFE", av: "CS", grad: "from-[#ff6b35] to-[#f72585]" },
              { name: "Warden", phone: "+91 98765 00001", av: "W", grad: "from-[#06d6a0] to-[#4cc9f0]" },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white bg-gradient-to-br ${c.grad} flex-shrink-0`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {c.av}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white" style={{ fontWeight: 600 }}>{c.name}</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{c.phone}</p>
                </div>
                <button className="text-xs px-3 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontWeight: 700 }}>Call</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

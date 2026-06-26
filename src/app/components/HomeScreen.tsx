import { useEffect, useState } from "react";
import { MapPin, TrendingUp, Zap, Coffee, ShoppingBag, Utensils, BookOpen, ChevronRight, Star, Clock, DollarSign, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getOutingsForUser, type OutingDocument } from "../../services/outingService";
import { getExpensesForUser, type ExpenseDocument } from "../../services/expenseService";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const trendingPlaces = [
  { name: "Brew & Bean", category: "Café", rating: 4.8, crowd: "Moderate", distance: "0.4 km", icon: Coffee, color: "from-[#f72585] to-[#c026d3]" },
  { name: "Study Loft", category: "Study", rating: 4.6, crowd: "Low", distance: "0.7 km", icon: BookOpen, color: "from-[#4361ee] to-[#4cc9f0]" },
  { name: "Campus Bites", category: "Food", rating: 4.5, crowd: "High", distance: "0.2 km", icon: Utensils, color: "from-[#ff6b35] to-[#f72585]" },
  { name: "Metro Mall", category: "Mall", rating: 4.3, crowd: "High", distance: "1.2 km", icon: ShoppingBag, color: "from-[#7209b7] to-[#c026d3]" },
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
  const { currentUser, loading } = useAuth();
  const [outings, setOutings] = useState<OutingDocument[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDocument[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?.uid) return;
      try {
        const oDocs = await getOutingsForUser(currentUser.uid);
        setOutings(oDocs);
        const eDocs = await getExpensesForUser(currentUser.uid);
        setExpenses(eDocs);
      } catch (err) {
        console.error("Failed to load outings or expenses", err);
      }
    };
    loadData();
  }, [currentUser?.uid]);

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : null;
  const completedOutings = outings.filter(o => o.status === "completed");
  const placesVisited = new Set(completedOutings.map(o => o.location.trim()).filter(Boolean)).size;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const outingsThisWeek = completedOutings.filter(o => o.startTime.toDate() >= oneWeekAgo).length;

  const totalDurationSeconds = completedOutings.reduce((sum, o) => sum + (o.duration || 0), 0);
  const totalHours = (totalDurationSeconds / 3600).toFixed(1);

  const spentThisWeek = expenses.filter(e => e.createdAt && e.createdAt.toDate() >= oneWeekAgo).reduce((sum, e) => sum + e.amount, 0);

  // Weekly spend mapping
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklySpendMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  const today = new Date();
  const currentDay = today.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const mondayOfThisWeek = new Date(today);
  mondayOfThisWeek.setDate(today.getDate() - distanceToMonday);
  mondayOfThisWeek.setHours(0, 0, 0, 0);

  expenses.forEach(e => {
    if (!e.createdAt) return;
    const date = e.createdAt.toDate();
    if (date >= mondayOfThisWeek) {
      const dayName = date.toLocaleDateString([], { weekday: 'short' });
      if (weeklySpendMap[dayName] !== undefined) {
        weeklySpendMap[dayName] += e.amount;
      }
    }
  });

  const weeklyData = daysOfWeek.map(day => ({
    day,
    spend: weeklySpendMap[day] || 0,
  }));

  // Spend by Category
  const catColors: Record<string, string> = { Food: "#f72585", Shopping: "#7209b7", Travel: "#4cc9f0", Entertainment: "#ff6b35", Study: "#06d6a0", Other: "#8888aa" };
  const catSum: Record<string, number> = { Food: 0, Shopping: 0, Travel: 0, Entertainment: 0, Study: 0, Other: 0 };

  expenses.forEach(e => {
    const cat = e.category || "Other";
    if (catSum[cat] !== undefined) {
      catSum[cat] += e.amount;
    } else {
      catSum["Other"] += e.amount;
    }
  });

  const spendingByCategory = Object.entries(catSum)
    .map(([name, value]) => ({
      name,
      value,
      color: catColors[name] || "#8888aa",
    }))
    .filter(item => item.value > 0);

  // Monthly Outings count
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyCountMap: Record<string, number> = {};
  months.forEach(m => { monthlyCountMap[m] = 0; });

  completedOutings.forEach(o => {
    const date = o.startTime.toDate();
    const monthName = date.toLocaleDateString([], { month: 'short' });
    if (monthlyCountMap[monthName] !== undefined) {
      monthlyCountMap[monthName]++;
    }
  });

  const monthlyOutings = months
    .map(month => ({
      month,
      count: monthlyCountMap[month] || 0,
    }))
    .slice(0, today.getMonth() + 1);

  // Analytics Cards
  const avgDurationSeconds = completedOutings.length > 0
    ? completedOutings.reduce((sum, o) => sum + o.duration, 0) / completedOutings.length
    : 0;
  const avgH = Math.floor(avgDurationSeconds / 3600);
  const avgM = Math.floor((avgDurationSeconds % 3600) / 60);
  const avgDurationVal = avgDurationSeconds > 0
    ? (avgH > 0 ? `${avgH}h ${avgM}m` : `${avgM}m`)
    : "0m";

  const longestDurationSeconds = completedOutings.length > 0
    ? Math.max(...completedOutings.map(o => o.duration))
    : 0;
  const longH = Math.floor(longestDurationSeconds / 3600);
  const longM = Math.floor((longestDurationSeconds % 3600) / 60);
  const longestOutingVal = longestDurationSeconds > 0
    ? (longH > 0 ? `${longH}h ${longM}m` : `${longM}m`)
    : "0m";

  const totalExpensesSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgSpendPerOuting = completedOutings.length > 0
    ? Math.round(totalExpensesSum / completedOutings.length)
    : 0;

  const dayCounts: Record<string, number> = {};
  completedOutings.forEach(o => {
    const day = o.startTime.toDate().toLocaleDateString([], { weekday: 'long' });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  let bestDay = "None";
  let maxCount = 0;
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxCount) {
      maxCount = count;
      bestDay = day;
    }
  });

  const analyticsCards = [
    { label: "Avg Duration", value: avgDurationVal, icon: Clock, grad: "from-[#4361ee] to-[#4cc9f0]", glow: "rgba(67,97,238,0.2)" },
    { label: "Longest Outing", value: longestOutingVal, icon: Zap, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
    { label: "Avg Spend/Outing", value: `₹${avgSpendPerOuting}`, icon: DollarSign, grad: "from-[#06d6a0] to-[#4cc9f0]", glow: "rgba(6,214,160,0.2)" },
    { label: "Best Day", value: bestDay, icon: TrendingUp, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
  ];

  const kpis = [
    { label: "This Week", value: `${outingsThisWeek}`, sub: "outings", icon: Activity, grad: "from-[#f72585] to-[#c026d3]", glow: "rgba(247,37,133,0.2)" },
    { label: "Hours Outside", value: `${totalHours}h`, sub: "total", icon: Clock, grad: "from-[#7209b7] to-[#4361ee]", glow: "rgba(114,9,183,0.2)" },
    { label: "Spent", value: `₹${spentThisWeek.toLocaleString()}`, sub: "this week", icon: DollarSign, grad: "from-[#4cc9f0] to-[#06d6a0]", glow: "rgba(76,201,240,0.2)" },
    { label: "Places", value: `${placesVisited}`, sub: "visited", icon: MapPin, grad: "from-[#ff6b35] to-[#f72585]", glow: "rgba(255,107,53,0.2)" },
  ];

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm mb-1" style={{ color: '#8888aa' }}>Good afternoon ☀️  Tuesday, Jun 9</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: '#f0f0ff', letterSpacing: '-0.02em' }}>
            {loading ? (
              <span style={{ color: '#8888aa' }}>Loading...</span>
            ) : (
              <>
                Hey {firstName ?? 'there'}, what's the{" "}
                <span style={{ background: 'linear-gradient(90deg, #f72585, #c026d3, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  vibe today? 🔥
                </span>
              </>
            )}
          </h1>
        </div>
        <button onClick={onStartOuting} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800, boxShadow: '0 4px 20px rgba(247,37,133,0.4)' }}>
          <Zap size={15} fill="white" /> Start Outing
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(s => (
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

      {/* Spending chart */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Weekly Spending 💸</p>
            <p className="text-xs" style={{ color: '#8888aa' }}>Mon–Sun this week</p>
          </div>
          <div className="text-right">
            <p className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{spentThisWeek.toLocaleString()}</p>
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

      {/* Analytics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {analyticsCards.map(k => (
          <div key={k.label} className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', boxShadow: `0 4px 24px ${k.glow}` }}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${k.grad} mb-2`}>
              <k.icon size={16} className="text-white" />
            </div>
            <p className="text-white text-xl leading-none mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{k.value}</p>
            <p className="text-xs" style={{ color: '#8888aa' }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Spend by Category 🥧</p>
              <p className="text-xs" style={{ color: '#8888aa' }}>Breakdown of spending habits</p>
            </div>
          </div>
          {spendingByCategory.length === 0 ? (
            <div className="h-[140px] flex items-center justify-center text-xs" style={{ color: '#8888aa' }}>
              No expenses recorded yet.
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                      {spendingByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {spendingByCategory.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-xs" style={{ color: '#8888aa' }}>{cat.name}</span>
                    </div>
                    <span className="text-xs text-white" style={{ fontWeight: 700 }}>₹{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Monthly Outing Frequency 📈</p>
              <p className="text-xs" style={{ color: '#8888aa' }}>Trend across the semester</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
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

      {/* Bottom row */}
      <div className="mb-4">
        {/* Trending */}
        <div className="rounded-2xl p-5" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
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
      </div>
    </div>
  );
}

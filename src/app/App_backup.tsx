import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/outings"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
        {/* Glow top */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(247,37,133,0.15) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="px-5 py-5 relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em' }}>
              Campus<span style={{ background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pulse</span>
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8888aa' }}>Smart Student Companion</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 relative">
          {navItems.map(item => {
            const active = activeTab === item.id;
            const grad = navGradients[item.id];
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden md:justify-center lg:justify-start ${active ? 'text-white' : 'text-[#8888aa] hover:text-white hover:bg-white/5'}`}
                style={active ? { background: 'rgba(255,255,255,0.08)' } : {}}
              >
                {active && (
                  <div className={`absolute inset-0 opacity-15 bg-gradient-to-r ${grad} rounded-2xl`} />
                )}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative transition-all ${active ? `bg-gradient-to-br ${grad}` : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <item.icon size={16} className="text-white" strokeWidth={active ? 2.5 : 2} />
                  {item.id === "outings" && isOutingActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#06d6a0] rounded-full border border-[#111127]" />
                  )}
                </div>
                <span className="hidden lg:block relative text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: active ? 800 : 600 }}>{item.label}</span>
                {active && <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-br ${grad} relative`} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-5">
          <div className="p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                {currentUser ? (currentUser.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : 'AS'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{currentUser ? currentUser.name : 'Arjun Singh'}</p>
                <p className="text-[10px]" style={{ color: '#8888aa' }}>{currentUser ? `${currentUser.course} · ${currentUser.year}` : 'CSE · 3rd Year'}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#06d6a0]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer (slide-out) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!mobileOpen} style={{ background: '#111127', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-full flex flex-col">
          <div className="px-5 py-5 relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)' }}>
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em' }}>
                  Campus<span style={{ background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pulse</span>
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: '#8888aa' }}>Smart Student Companion</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-2 space-y-1 relative">
            {navItems.map(item => {
              const active = activeTab === item.id;
              const grad = navGradients[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden ${active ? 'text-white' : 'text-[#8888aa] hover:text-white hover:bg-white/5'}`}
                  style={active ? { background: 'rgba(255,255,255,0.08)' } : {}}
                >
                  {active && (
                    <div className={`absolute inset-0 opacity-15 bg-gradient-to-r ${grad} rounded-2xl`} />
                  )}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative transition-all ${active ? `bg-gradient-to-br ${grad}` : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <item.icon size={16} className="text-white" strokeWidth={active ? 2.5 : 2} />
                    {item.id === "outings" && isOutingActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#06d6a0] rounded-full border border-[#111127]" />
                    )}
                  </div>
                  <span className="relative text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: active ? 800 : 600 }}>{item.label}</span>
                  {active && <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-br ${grad} relative`} />}
                </button>
              );
            })}
          </nav>

          <div className="px-3 pb-5">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>AS</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Arjun Singh</p>
                  <p className="text-[10px]" style={{ color: '#8888aa' }}>CSE · 3rd Year</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#06d6a0]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay to close drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)} style={{ background: 'rgba(0,0,0,0.4)' }} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-full" style={{ background: '#0d0d1a' }}>
        {/* Topbar */}
        <header className="h-14 flex items-center px-6 gap-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,13,26,0.9)', backdropFilter: 'blur(12px)' }}>
          <div className="md:hidden flex items-center mr-2">
            <button onClick={() => setMobileOpen((s) => !s)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Menu size={16} className="text-white" />
            </button>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888aa' }} />
              <input type="text" placeholder="Search anything..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }} />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {isOutingActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(6,214,160,0.15)', color: '#06d6a0', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
                Outing Live
              </div>
            )}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Bell size={15} className="text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#f72585] rounded-full border border-[#0d0d1a]" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{currentUser ? (currentUser.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : 'AS'}</div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">Loading...</div>
          ) : !currentUser ? (
            <div className="h-full flex items-center justify-center">
              <div className="bg-[#0d0d1a] p-6 rounded-2xl shadow-lg" style={{ width: 920 }}>
                <div className="grid grid-cols-2 gap-6">
                  <Login onSwitch={(s) => { if (s === 'signup') setActiveTab('profile'); }} />
                  <Signup />
                </div>
              </div>
            </div>
          ) : (
            renderScreen()
          )}
        </main>
      </div>
    </div>
  );
}

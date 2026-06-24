import { useState } from "react";
import { MapPin } from "lucide-react";

export function SafetyScreen() {
  const [safetyOn, setSafetyOn] = useState(false);
  const [sosPressed, setSosPressed] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>Safety Center 🔒</h2>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl p-6 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a0a0a, #0d0d1a)', border: '1px solid rgba(255,77,77,0.2)', boxShadow: '0 4px 24px rgba(255,77,77,0.1)' }}>
            <p className="text-sm text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Emergency SOS 🆘</p>
            <button
              onMouseDown={() => setSosPressed(true)} 
              onMouseUp={() => setSosPressed(false)} 
              onMouseLeave={() => setSosPressed(false)}
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
              <button 
                onClick={() => setSafetyOn(p => !p)}
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
    </div>
  );
}

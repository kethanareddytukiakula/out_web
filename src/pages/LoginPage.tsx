import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../app/components/ui/input";
import { Button } from "../app/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: '#0d0d1a' }}>
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(247,37,133,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)' }}>
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>
              Campus<span style={{ background: 'linear-gradient(90deg, #f72585, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pulse</span>
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8888aa' }}>Smart Student Companion</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-8" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: '#f0f0ff', marginBottom: 8 }}>Welcome back</h1>
          <p className="text-sm" style={{ color: '#8888aa', marginBottom: 24 }}>Sign in to your CampusPulse account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 8 }}>Email</label>
              <Input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 8 }}>Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg p-3" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
              style={{ background: loading ? 'rgba(192, 38, 211, 0.5)' : 'linear-gradient(135deg, #f72585, #c026d3)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#8888aa' }}>
              Don't have an account?{' '}
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold transition-colors hover:text-white"
                style={{ color: '#c026d3' }}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

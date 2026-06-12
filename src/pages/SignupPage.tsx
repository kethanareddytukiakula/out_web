import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../app/components/ui/input";
import { Button } from "../app/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Zap } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    course: "",
    year: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(formData);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: '#0d0d1a' }}>
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(247,37,133,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: '#f0f0ff', marginBottom: 8 }}>Create account</h1>
          <p className="text-sm" style={{ color: '#8888aa', marginBottom: 24 }}>Join CampusPulse to track outings and connect with campus</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Registration Number</label>
              <Input
                type="text"
                name="regNo"
                placeholder="21CSE045"
                value={formData.regNo}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Course</label>
              <Input
                type="text"
                name="course"
                placeholder="Computer Science Engineering"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Year</label>
              <Input
                type="text"
                name="year"
                placeholder="3rd Year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6 }}>Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#8888aa' }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold transition-colors hover:text-white"
                style={{ color: '#c026d3' }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

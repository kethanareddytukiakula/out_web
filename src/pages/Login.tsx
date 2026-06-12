import React, { useState } from "react";
import { Input } from "../app/components/ui/input";
import { Button } from "../app/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitch }: { onSwitch?: (s: 'login'|'signup') => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl" style={{ background: '#0d0d1a' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>Welcome back</h3>
      <p className="text-xs" style={{ color: '#8888aa', marginTop: 6 }}>Sign in to continue to CampusPulse</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          <button type="button" onClick={() => onSwitch && onSwitch('signup')} className="text-sm text-[#c026d3]">Create account</button>
        </div>
      </form>
    </div>
  );
}

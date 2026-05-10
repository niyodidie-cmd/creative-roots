'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-xl px-6 py-24">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] p-10 shadow-cinematic">
          <h1 className="text-4xl font-semibold text-white">Login</h1>
          <p className="mt-4 text-sand/80">Access your dashboard, manage bookings and join INKINGI programs.</p>
          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <label className="block">
              <span className="text-sm text-sand/70">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" />
            </label>
            <label className="block">
              <span className="text-sm text-sand/70">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 flex justify-between text-sm text-sand/70">
            <Link href="/auth/forgot-password" className="hover:text-white">Forgot password?</Link>
            <Link href="/auth/register" className="hover:text-white">Create account</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

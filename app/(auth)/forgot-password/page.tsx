'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

const forgotSchema = z.object({ email: z.string().email('Please enter a valid email.') });

type ForgotData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ForgotData>({ resolver: zodResolver(forgotSchema) });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: ForgotData) => {
    setStatus(null);
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || 'Unable to send reset email.');
      return;
    }
    setStatus('Check your inbox for password reset instructions.');
    reset();
  };

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-xl px-6 py-24">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] p-10 shadow-cinematic">
          <h1 className="text-4xl font-semibold text-white">Forgot password</h1>
          <p className="mt-4 text-sand/80">We’ll send reset instructions to your email so you can safely regain access.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <label className="block">
              <span className="text-sm text-sand/70">Email</span>
              <input type="email" className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('email')} />
              {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
            </label>
            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
            {status && <p className="text-sm text-sand/80">{status}</p>}
          </form>
          <p className="mt-6 text-sm text-sand/70">
            Remembered your password? <Link href="/auth/login" className="text-gold hover:text-yellow-300">Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

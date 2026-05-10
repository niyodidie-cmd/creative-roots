'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

type ResetData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResetData>({ resolver: zodResolver(resetSchema) });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: ResetData) => {
    setStatus(null);
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: data.password })
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || 'Unable to reset password.');
      return;
    }
    setStatus('Password reset successfully. You can now log in.');
    reset();
  };

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-xl px-6 py-24">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] p-10 shadow-cinematic">
          <h1 className="text-4xl font-semibold text-white">Reset password</h1>
          <p className="mt-4 text-sand/80">Choose a new password to secure your INKINGI access.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <label className="block">
              <span className="text-sm text-sand/70">New password</span>
              <input type="password" className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('password')} />
              {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>}
            </label>
            <button type="submit" disabled={isSubmitting || !token} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
              {isSubmitting ? 'Resetting…' : 'Reset password'}
            </button>
            {status && <p className="text-sm text-sand/80">{status}</p>}
            {!token && <p className="text-sm text-red-400">No password reset token found.</p>}
          </form>
          <p className="mt-6 text-sm text-sand/70">
            <Link href="/auth/login" className="text-gold hover:text-yellow-300">Return to login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

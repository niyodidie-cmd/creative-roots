'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: RegisterData) => {
    setStatus(null);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || 'Unable to register.');
      return;
    }
    setStatus('Registration successful. Check your inbox for email verification.');
    reset();
  };

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-xl px-6 py-24">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] p-10 shadow-cinematic">
          <h1 className="text-4xl font-semibold text-white">Register</h1>
          <p className="mt-4 text-sand/80">Create a secure account to book events, access programs, and manage your profile.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <label className="block">
              <span className="text-sm text-sand/70">Name</span>
              <input className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('name')} />
              {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm text-sand/70">Email</span>
              <input type="email" className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('email')} />
              {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm text-sand/70">Password</span>
              <input type="password" className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('password')} />
              {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>}
            </label>
            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
              {isSubmitting ? 'Registering…' : 'Create account'}
            </button>
            {status && <p className="text-sm text-sand/80">{status}</p>}
          </form>
          <p className="mt-6 text-sm text-sand/70">
            Already have an account? <Link href="/auth/login" className="text-gold hover:text-yellow-300">Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

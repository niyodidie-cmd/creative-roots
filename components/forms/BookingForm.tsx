'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  service: z.string().min(1, 'Select a service.'),
  message: z.string().min(10, 'Tell us more about your request.')
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormData>({ resolver: zodResolver(bookingSchema) });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: BookingFormData) => {
    setStatus(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit request.');
      setStatus('Your booking request has been submitted. Check your email for confirmation.');
      reset();
    } catch {
      setStatus('There was an error submitting the booking. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>
      <label className="block">
        <span className="text-sm text-sand/70">Service</span>
        <select className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('service')}>
          <option value="">Choose a service</option>
          <option value="event-booking">Event booking</option>
          <option value="workshop-registration">Workshop registration</option>
          <option value="media-production">Media production</option>
          <option value="program-application">Program application</option>
        </select>
        {errors.service && <p className="mt-2 text-xs text-red-400">{errors.service.message}</p>}
      </label>
      <label className="block">
        <span className="text-sm text-sand/70">Message</span>
        <textarea rows={5} className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('message')} />
        {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message.message}</p>}
      </label>
      <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
        {isSubmitting ? 'Submitting…' : 'Send booking request'}
      </button>
      {status && <p className="text-sm text-sand/80">{status}</p>}
    </form>
  );
}

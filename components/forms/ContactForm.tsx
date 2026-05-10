'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  subject: z.string().min(4, 'Please add a subject.'),
  message: z.string().min(10, 'Please share your message.')
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setStatus(null);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send message.');
      setStatus('Message sent successfully. Our team will reach out soon.');
      reset();
    } catch (error) {
      setStatus('Unable to send message. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <span className="text-sm text-sand/70">Subject</span>
        <input className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('subject')} />
        {errors.subject && <p className="mt-2 text-xs text-red-400">{errors.subject.message}</p>}
      </label>
      <label className="block">
        <span className="text-sm text-sand/70">Message</span>
        <textarea rows={5} className="mt-2 w-full rounded-3xl border border-white/10 bg-[#081022] px-4 py-3 text-sand outline-none focus:border-gold" {...register('message')} />
        {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message.message}</p>}
      </label>
      <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
      {status && <p className="text-sm text-sand/80">{status}</p>}
    </form>
  );
}

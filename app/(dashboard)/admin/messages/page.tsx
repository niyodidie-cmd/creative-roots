import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { prisma } from '@lib/prisma';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import type { Message } from '@prisma/client';

export default async function AdminMessagesPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/auth/login');
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#09101f] p-8 shadow-cinematic">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Admin panel</p>
            <h1 className="mt-6 text-3xl font-semibold text-white">Messages</h1>
            <nav className="mt-12 space-y-2">
              <a href="/dashboard/admin" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Dashboard</a>
              <a href="/dashboard/admin/bookings" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Bookings</a>
              <a href="/dashboard/admin/messages" className="block rounded-3xl bg-gold px-4 py-3 text-ink">Messages</a>
              <a href="/dashboard/admin/users" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Users</a>
            </nav>
          </aside>
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">All messages</h2>
              <div className="mt-8 space-y-4">
                {messages.map((message: Message) => (
                  <div key={message.id} className="rounded-3xl border border-white/10 bg-[#091524] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{message.name}</p>
                        <p className="text-sm text-sand/80">{message.email}</p>
                        <p className="text-sm text-gold">{message.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${message.status === 'READ' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {message.status}
                        </p>
                        <p className="text-xs text-sand/60">{message.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sand/80">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
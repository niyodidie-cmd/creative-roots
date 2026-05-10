import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { prisma } from '@lib/prisma';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import type { Booking, Message } from '@prisma/client';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard/user');
  }

  const [bookings, messages, users] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.user.count()
  ]);

  const totalBookings = await prisma.booking.count();
  const totalMessages = await prisma.message.count();

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#09101f] p-8 shadow-cinematic">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Admin panel</p>
            <h1 className="mt-6 text-3xl font-semibold text-white">System overview</h1>
            <div className="mt-8 space-y-4 text-sand/80">
              <p>{user.name || user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <nav className="mt-12 space-y-2">
              <a href="/dashboard/admin" className="block rounded-3xl bg-gold px-4 py-3 text-ink">Dashboard</a>
              <a href="/dashboard/admin/bookings" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Bookings</a>
              <a href="/dashboard/admin/messages" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Messages</a>
              <a href="/dashboard/admin/users" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Users</a>
              <a href="/dashboard/admin/events" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Events</a>
              <a href="/dashboard/admin/gallery" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Gallery</a>
            </nav>
          </aside>
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">Analytics overview</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  { title: 'Users', value: users.toString() },
                  { title: 'Bookings', value: totalBookings.toString() },
                  { title: 'Messages', value: totalMessages.toString() }
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl bg-[#091525] p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-gold">{item.title}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">Recent bookings</h2>
              <ul className="mt-6 space-y-4">
                {bookings.map((booking: Booking) => (
                  <li key={booking.id} className="rounded-3xl border border-white/10 bg-[#091524] p-6">
                    <p className="text-sm text-sand/80">{booking.name} - {booking.service}</p>
                    <p className="text-xs text-gold">{booking.status}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">Recent messages</h2>
              <ul className="mt-6 space-y-4">
                {messages.map((message: Message) => (
                  <li key={message.id} className="rounded-3xl border border-white/10 bg-[#091524] p-6">
                    <p className="text-sm text-sand/80">{message.name} - {message.subject}</p>
                    <p className="text-xs text-gold">{message.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

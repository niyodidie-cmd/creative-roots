import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { prisma } from '@lib/prisma';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import type { User } from '@prisma/client';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/auth/login');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#09101f] p-8 shadow-cinematic">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Admin panel</p>
            <h1 className="mt-6 text-3xl font-semibold text-white">Users</h1>
            <nav className="mt-12 space-y-2">
              <a href="/dashboard/admin" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Dashboard</a>
              <a href="/dashboard/admin/bookings" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Bookings</a>
              <a href="/dashboard/admin/messages" className="block rounded-3xl border border-white/10 px-4 py-3 text-sand/70 hover:border-gold">Messages</a>
              <a href="/dashboard/admin/users" className="block rounded-3xl bg-gold px-4 py-3 text-ink">Users</a>
            </nav>
          </aside>
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">All users</h2>
              <div className="mt-8 space-y-4">
                {users.map((u: User) => (
                  <div key={u.id} className="rounded-3xl border border-white/10 bg-[#091524] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{u.name}</p>
                        <p className="text-sm text-sand/80">{u.email}</p>
                        <p className={`text-sm ${u.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gold">{u.role}</p>
                        <p className="text-xs text-sand/60">{u.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
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
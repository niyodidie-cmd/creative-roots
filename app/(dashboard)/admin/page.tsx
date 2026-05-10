import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard/user');
  }

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
          </aside>
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">Analytics cards</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {[
                  { title: 'Users', value: '1,280' },
                  { title: 'Bookings', value: '680' },
                  { title: 'Messages', value: '420' }
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl bg-[#091525] p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-gold">{item.title}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#0b1321] p-8 shadow-cinematic">
              <h2 className="text-2xl font-semibold text-white">Recent activity</h2>
              <ul className="mt-6 space-y-4 text-sand/80">
                <li className="rounded-3xl border border-white/10 bg-[#091524] p-6">New booking received for community tour.</li>
                <li className="rounded-3xl border border-white/10 bg-[#091524] p-6">User account verified and promoted to ADMIN.</li>
                <li className="rounded-3xl border border-white/10 bg-[#091524] p-6">Email notification sent to sponsor partner.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

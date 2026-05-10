import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

export default async function UserDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'USER') {
    redirect('/dashboard/admin');
  }

  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-[#09101f] p-10 shadow-cinematic">
          <h1 className="text-4xl font-semibold text-white">Welcome, {user.name || user.email}</h1>
          <p className="mt-4 text-sand/80">Your user dashboard provides quick access to your programs, booking history, and account settings.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0d1424] p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Profile</p>
              <p className="mt-4 text-sand/80">{user.name}</p>
              <p className="mt-2 text-sand/80">{user.email}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0d1424] p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Role</p>
              <p className="mt-4 text-3xl font-semibold text-white">{user.role}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

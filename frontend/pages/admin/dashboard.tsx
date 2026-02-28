import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';
import AdminStats from '@components/AdminStats';

interface DashboardStats {
  events: number;
  bookings: number;
  donations: number;
  totalRevenue: number;
  recentBookings: Array<{ _id: string; name: string; email: string; attendees: number; eventTitle: string; status?: string; amount?: number; createdAt: string }>;
  recentDonations: Array<{ _id: string; donorName: string; donorEmail?: string; donorPhone?: string; amount: number; status: string; createdAt: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin Dashboard | Creative Roots Rwanda</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <AdminSidebar open={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-warm-brown hover:bg-gray-100 p-2 rounded"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold text-warm-brown">Dashboard</h1>
            <div></div>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center text-lg">Loading dashboard...</div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-dark-charcoal mb-8">Welcome Back</h2>
                {stats && <AdminStats stats={stats} />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';
import AdminStats from '@components/AdminStats';

interface DashboardStats {
  totalEvents: number;
  totalGalleryItems: number;
  totalMessages: number;
  totalVolunteers: number;
  totalDonations: number;
  totalVisitors: number;
  recentActivity: Array<{
    _id: string;
    action: string;
    description: string;
    adminUsername?: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Fetch counts from different endpoints
        const [eventsRes, galleryRes, messagesRes, volunteersRes, donationsRes, visitorsRes, activityRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/stats?period=30`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity-logs/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (eventsRes.ok && galleryRes.ok && messagesRes.ok && volunteersRes.ok && donationsRes.ok && visitorsRes.ok && activityRes.ok) {
          const [events, gallery, messages, volunteers, donations, visitors, activity] = await Promise.all([
            eventsRes.json(),
            galleryRes.json(),
            messagesRes.json(),
            volunteersRes.json(),
            donationsRes.json(),
            visitorsRes.json(),
            activityRes.json(),
          ]);

          setStats({
            totalEvents: events.length,
            totalGalleryItems: gallery.length,
            totalMessages: messages.length,
            totalVolunteers: volunteers.length,
            totalDonations: donations.length,
            totalVisitors: visitors.totalVisitors,
            recentActivity: activity,
          });
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

                {/* Quick Action Buttons */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <button
                    onClick={() => router.push('/admin/events')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">➕</span>
                    Add Event
                  </button>
                  <button
                    onClick={() => router.push('/admin/gallery')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">➕</span>
                    Add Gallery Item
                  </button>
                  <button
                    onClick={() => router.push('/admin/stories')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">➕</span>
                    Add Testimonial
                  </button>
                </div>

                {stats && <AdminStats stats={stats} />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

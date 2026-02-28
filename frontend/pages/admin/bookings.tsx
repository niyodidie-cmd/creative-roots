import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';

interface Booking {
  _id: string;
  name: string;
  email: string;
  attendees: number;
  eventTitle: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
        alert('Booking deleted');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/export/csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.csv';
      a.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Bookings | Admin Dashboard</title>
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
            <h1 className="text-2xl font-bold text-warm-brown">Bookings</h1>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              📥 Export CSV
            </button>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center">Loading bookings...</div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Total Bookings: {bookings.length}
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Attendees
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{booking.name}</td>
                          <td className="px-6 py-4">{booking.email}</td>
                          <td className="px-6 py-4">{booking.eventTitle}</td>
                          <td className="px-6 py-4">{booking.attendees}</td>
                          <td className="px-6 py-4">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

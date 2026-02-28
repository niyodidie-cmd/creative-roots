import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setEvents(events.filter((e) => e._id !== id));
        alert('Event deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Events | Admin Dashboard</title>
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
            <h1 className="text-2xl font-bold text-warm-brown">Events</h1>
            <button className="bg-warm-brown text-cream px-4 py-2 rounded-lg hover:bg-orange-900 transition">
              + Add Event
            </button>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center">Loading events...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{event.title}</td>
                        <td className="px-6 py-4">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{event.location}</td>
                        <td className="px-6 py-4">{event.capacity}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button className="text-blue-600 hover:underline">Edit</button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
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
            )}
          </main>
        </div>
      </div>
    </>
  );
}

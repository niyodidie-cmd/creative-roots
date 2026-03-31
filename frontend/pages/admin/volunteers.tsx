import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';

interface Volunteer { _id: string; name: string; email: string; phone: string; skills: string; status: string; createdAt: string; }

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const loadVolunteers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      }
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVolunteers(); }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete volunteer?')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadVolunteers();
  };

  const handleStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadVolunteers();
  };

  return (
    <>
      <Head>
        <title>Volunteers | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <AdminSidebar open={sidebarOpen} />

        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow p-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-warm-brown hover:bg-gray-100 p-2 rounded">☰</button>
            <h1 className="text-2xl font-bold text-warm-brown">Volunteers</h1>
            <div></div>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center">Loading volunteers...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Phone</th>
                      <th className="px-6 py-3 text-left">Skills</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map((vol) => (
                      <tr key={vol._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{vol.name}</td>
                        <td className="px-6 py-4">{vol.email}</td>
                        <td className="px-6 py-4">{vol.phone}</td>
                        <td className="px-6 py-4">{vol.skills}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-sm bg-warm-brown/20 text-warm-brown">{vol.status}</span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => handleStatus(vol._id, 'contacted')}>Contacted</button>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleStatus(vol._id, 'assigned')}>Assign</button>
                          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(vol._id)}>Delete</button>
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

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';

interface Donation {
  _id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setDonations(data);
        }
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = donations
    .filter((d) => d.status === 'success')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <Head>
        <title>Donations | Admin Dashboard</title>
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
            <h1 className="text-2xl font-bold text-warm-brown">Donations</h1>
            <div></div>
          </header>

          <main className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-warm-brown">{donations.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600">Successful</p>
                <p className="text-3xl font-bold text-green-600">
                  {donations.filter((d) => d.status === 'success').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600">Total Raised</p>
                <p className="text-3xl font-bold text-warm-brown">
                  {totalAmount.toLocaleString()} RWF
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center">Loading donations...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{donation.donorName}</p>
                            <p className="text-sm text-gray-600">{donation.donorEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {donation.amount.toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4">{donation.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(donation.createdAt).toLocaleDateString()}
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

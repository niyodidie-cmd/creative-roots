import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminSidebar from '@components/AdminSidebar';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Artwork',
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
        alert('Item deleted');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Gallery | Admin Dashboard</title>
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
            <h1 className="text-2xl font-bold text-warm-brown">Gallery</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-warm-brown text-cream px-4 py-2 rounded-lg hover:bg-orange-900 transition"
            >
              {showForm ? '✕ Close' : '+ Upload'}
            </button>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center">Loading gallery...</div>
            ) : (
              <>
                {showForm && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Upload Image</h3>
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder="Title"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      <textarea
                        placeholder="Description"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                      <input
                        type="file"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <button
                        type="submit"
                        className="bg-warm-brown text-cream px-6 py-2 rounded-lg hover:bg-orange-900"
                      >
                        Upload
                      </button>
                    </form>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="w-full h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-warm-brown mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:underline text-sm">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

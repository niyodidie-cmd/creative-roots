import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@components/AdminSidebar';

interface Story {
  _id: string;
  title: string;
  description: string;
  author: string;
  imageUrl?: string;
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    void router;
  }, [router]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
        if (res.ok) {
          const data = await res.json();
          setStories(data);
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Delete this success story?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setStories(stories.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Success Stories | Admin Dashboard</title>
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
            <h1 className="text-2xl font-bold text-warm-brown">Success Stories</h1>
            <button className="bg-warm-brown text-cream px-4 py-2 rounded-lg hover:bg-orange-900 transition">
              + Add Story
            </button>
          </header>

          <main className="p-6">
            {loading ? (
              <div className="text-center">Loading stories...</div>
            ) : (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div
                    key={story._id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex gap-4">
                      {story.imageUrl && (
                        <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-warm-brown mb-2">
                          {story.title}
                        </h3>
                        <p className="text-gray-700 mb-2">{story.description}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          By: {story.author}
                        </p>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:underline text-sm">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story._id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

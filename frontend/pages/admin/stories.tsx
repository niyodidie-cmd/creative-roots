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
  videoUrl?: string;
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    videoUrl: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingStory ? 'PUT' : 'POST';
    const url = editingStory
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${editingStory._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/stories`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: new FormData(),
      });

      // For simplicity, assuming no file upload for now
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('author', formData.author);
      formDataObj.append('videoUrl', formData.videoUrl);

      const res2 = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (res2.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', author: '', videoUrl: '' });
        setEditingStory(null);
        // Refresh stories
        const fetchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          setStories(data);
        }
      }
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      description: story.description,
      author: story.author,
      videoUrl: story.videoUrl || '',
    });
    setShowForm(true);
  };

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
            <h1 className="text-2xl font-bold text-warm-brown">Voice of Impact</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingStory(null);
                setFormData({ title: '', description: '', author: '', videoUrl: '' });
              }}
              className="bg-warm-brown text-cream px-4 py-2 rounded-lg hover:bg-orange-900 transition"
            >
              {showForm ? '✕ Close' : '+ Add Testimony'}
            </button>
          </header>

          <main className="p-6">
            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingStory ? 'Edit Testimony' : 'Add New Testimony'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author (optional)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="YouTube Video URL (optional)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-warm-brown text-cream px-6 py-2 rounded-lg hover:bg-orange-900"
                  >
                    {editingStory ? 'Update' : 'Add'} Testimony
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center">Loading testimonies...</div>
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
                          <button
                            onClick={() => handleEdit(story)}
                            className="text-blue-600 hover:underline text-sm"
                          >
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

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
        const data = await res.json();
        setGalleryItems(data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <>
      <Head>
        <title>Gallery | Creative Roots Rwanda</title>
        <meta name="description" content="Browse our gallery of artworks and creative projects" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen">
          <h1 className="text-4xl font-bold text-warm-brown mb-12 text-center">Our Gallery</h1>

          {loading ? (
            <div className="text-center text-lg text-dark-charcoal">Loading gallery...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center text-lg text-dark-charcoal">No gallery items available yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative w-full h-64 bg-gray-200">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-warm-brown mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <p className="text-dark-charcoal text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

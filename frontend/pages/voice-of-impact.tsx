import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

interface Story {
  _id: string;
  title: string;
  description: string;
  author: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default function VoiceOfImpact() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
  };

  return (
    <>
      <Head>
        <title>Voice of Impact | Creative Roots Rwanda</title>
        <meta name="description" content="Hear the voices of those impacted by Creative Roots Rwanda" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-warm-brown mb-12 text-center">Voice of Impact</h1>

          {loading ? (
            <div className="text-center text-lg text-dark-charcoal">Loading testimonies...</div>
          ) : stories.length === 0 ? (
            <div className="text-center text-lg text-dark-charcoal">No testimonies available yet.</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  {story.videoUrl && getYouTubeEmbedUrl(story.videoUrl) && (
                    <div className="relative w-full h-56 bg-gray-200">
                      <iframe
                        src={getYouTubeEmbedUrl(story.videoUrl)}
                        title={story.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {!story.videoUrl && story.imageUrl && (
                    <div className="relative w-full h-56 bg-gray-200">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-warm-brown mb-3">{story.title}</h3>
                    <p className="text-dark-charcoal text-sm mb-4 leading-relaxed">{story.description}</p>
                    <p className="text-sm text-gray-600 italic">- {story.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Footer />
    </>
  );
}

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import HeroSlideshow from '@components/HeroSlideshow';
import Footer from '@components/Footer';
import Section from '@components/Section';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

function GalleryPreview() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery?featured=true`);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch gallery preview:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <p className="text-center text-dark-charcoal">Loading gallery...</p>;
  }

  if (!items.length) {
    return <p className="text-center text-dark-charcoal">No featured gallery items yet.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item._id} className="rounded-xl overflow-hidden shadow-lg bg-white">
          <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg text-warm-brown mb-1">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VolunteerForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', skills: '' });
  const [status, setStatus] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Volunteer application submitted, thank you!');
        setFormData({ name: '', email: '', phone: '', skills: '' });
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to submit volunteer form');
      }
    } catch (error) {
      console.error(error);
      setStatus('Network error submitting volunteer request');
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 bg-white p-8 rounded-xl shadow-lg">
      <div className="grid gap-2 md:grid-cols-2">
        <input name="name" value={formData.name} onChange={onChange} required placeholder="Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
        <input name="email" type="email" value={formData.email} onChange={onChange} required placeholder="Email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input name="phone" value={formData.phone} onChange={onChange} required placeholder="Phone" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
        <input name="skills" value={formData.skills} onChange={onChange} placeholder="Skills / Interests" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
      </div>
      <button type="submit" className="w-full bg-warm-brown text-cream py-3 rounded-lg font-semibold hover:bg-orange-900">Submit Volunteer Interest</button>
      {status && <p className="text-center text-sm text-dark-charcoal">{status}</p>}
    </form>
  );
}

function DonationForm() {
  const [formData, setFormData] = useState({ donor_name: '', donor_email: '', donor_phone: '', amount: '' });
  const [status, setStatus] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          donor_phone: formData.donor_phone,
          amount: Number(formData.amount),
        }),
      });
      if (res.ok) {
        setStatus('Thank you! Your donation is recorded and will be reviewed by admin.');
        setFormData({ donor_name: '', donor_email: '', donor_phone: '', amount: '' });
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to save donation');
      }
    } catch (error) {
      console.error(error);
      setStatus('Network error sending donation');
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 bg-cream p-8 rounded-xl shadow-lg">
      <div className="grid gap-2 md:grid-cols-2">
        <input name="donor_name" value={formData.donor_name} onChange={onChange} required placeholder="Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
        <input name="donor_email" type="email" value={formData.donor_email} onChange={onChange} placeholder="Email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input name="donor_phone" value={formData.donor_phone} onChange={onChange} required placeholder="Phone" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
        <input name="amount" type="number" value={formData.amount} min="100" onChange={onChange} required placeholder="Amount (RWF)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-warm-brown" />
      </div>
      <button type="submit" className="w-full bg-warm-brown text-cream py-3 rounded-lg font-semibold hover:bg-orange-900">Submit Donation</button>
      {status && <p className="text-center text-sm text-dark-charcoal">{status}</p>}
    </form>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Creative Roots Rwanda | Art & Stories for All</title>
        <meta name="description" content="Empowering youth through art, sculpture, and storytelling" />
      </Head>

      <Navbar />
      <HeroSlideshow />

      <Section className="bg-cream py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-brown mb-6 text-center">Our Mission</h2>
          <p className="text-base md:text-lg text-dark-charcoal leading-relaxed text-center max-w-3xl mx-auto">
            Art & Stories for All empowers youth through art, sculpture, and storytelling. We make community creative opportunities accessible to everyone.
          </p>
        </div>
      </Section>

      <Section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-brown mb-8 text-center">Featured Gallery</h2>
          <GalleryPreview />
        </div>
      </Section>

      <Section id="join" className="bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-brown mb-6 text-center">Ready to Join Us?</h2>
          <p className="text-center text-dark-charcoal mb-8">Become a volunteer and contribute your skills to our creative community.</p>
          <VolunteerForm />
        </div>
      </Section>

      <Section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-brown mb-6 text-center">Support the Cause</h2>
          <DonationForm />
        </div>
      </Section>

      <Footer />
    </>
  );
}

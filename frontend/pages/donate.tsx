import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

export default function Donate() {
  const [formData, setFormData] = useState({ donor_name: '', donor_email: '', donor_phone: '', amount: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

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
        setMessage('✅ Donation saved. Admin will process it shortly. Thank you!');
        setFormData({ donor_name: '', donor_email: '', donor_phone: '', amount: '' });
      } else {
        const data = await res.json();
        setMessage(`⚠️ ${data.error || 'Unable to submit donation at this time.'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Donate | Creative Roots Rwanda</title>
        <meta name="description" content="Support Creative Roots Rwanda with your donation" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen py-16">
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-warm-brown mb-6 text-center">Support Our Mission</h1>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <p className="text-dark-charcoal text-base">
              Use the form below to submit a donation request. No direct payment is processed here, so we can keep it simple and secure. Admin will review and confirm once the donation is registered.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input name="donor_name" value={formData.donor_name} onChange={handleInputChange} required placeholder="Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-brown" />
              <input name="donor_email" type="email" value={formData.donor_email} onChange={handleInputChange} placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-brown" />
              <input name="donor_phone" value={formData.donor_phone} onChange={handleInputChange} required placeholder="Contact" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-brown" />
              <input name="amount" type="number" value={formData.amount} min="100" onChange={handleInputChange} required placeholder="Amount (RWF)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-brown" />

              <button type="submit" disabled={loading} className="w-full bg-warm-brown text-cream py-3 rounded-lg font-semibold hover:bg-orange-900 disabled:opacity-50">
                {loading ? 'Submitting…' : 'Submit Donation'}
              </button>
            </form>

            {message && <div className="text-center text-sm text-dark-charcoal">{message}</div>}
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}



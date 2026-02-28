import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Creative Roots Rwanda</title>
        <meta name="description" content="Get in touch with Creative Roots Rwanda" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen">
          <h1 className="text-4xl font-bold text-warm-brown mb-12 text-center">Contact Us</h1>

          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Thank you for contacting us. We will respond soon!
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-warm-brown text-cream py-3 rounded-lg font-semibold hover:bg-orange-900 transition"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-700">
              <p>Or connect with us on social media:</p>
              <p>
                <a href="https://instagram.com/creativerootsRW" target="_blank" className="underline">
                  Instagram (@creativerootsRW)
                </a>{' '}
                |{' '}
                <a href="https://facebook.com/creativerootsRW" target="_blank" className="underline">
                  Facebook
                </a>
              </p>
            </div>
          </div>
      </Section>

      <Footer />
    </>
  );
}

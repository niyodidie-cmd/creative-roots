import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

export default function Donate() {
  const [donationMethod, setDonationMethod] = useState<'momo' | 'bank' | 'contact'>('momo');
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMoMoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations/momo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          donor_phone: formData.donor_phone,
          amount: parseInt(formData.amount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const momoAcct = process.env.NEXT_PUBLIC_MOMO_ACCOUNT || '';
        setMessage(
          `✓ Donation recorded! Please complete the payment for ${parseInt(
            formData.amount
          ).toLocaleString()} RWF on your MTN MoMo device.` +
            (momoAcct ? `\nMoMo Account: ${momoAcct}` : '')
        );
        setFormData({
          donor_name: '',
          donor_email: '',
          donor_phone: '',
          amount: '',
        });
      } else {
        setMessage(`✗ ${data.error || 'Donation failed'}`);
      }
    } catch (error) {
      console.error('Donation error:', error);
      setMessage('✗ Error submitting donation');
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferClick = () => {
    const bankAcc = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '[contact admin]';
    setMessage(
      `✓ Bank Transfer Details:\nBank Account: ${bankAcc}\nPlease send a receipt to: donations@creativeroots.rw`
    );
  };

  const handleContactClick = () => {
    setMessage('✓ We will contact you shortly at ' + formData.donor_phone);
  };

  return (
    <>
      <Head>
        <title>Donate | Creative Roots Rwanda</title>
        <meta name="description" content="Support Creative Roots Rwanda with your donation" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen">
          <h1 className="text-4xl font-bold text-warm-brown mb-6 text-center">Support Our Mission</h1>

          <div className="mb-6 max-w-3xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded">
              <strong>Payment Methods Available:</strong>
              <ul className="mt-2 text-left inline-block">
                <li>✓ <strong>MTN MoMo</strong> - Mobile money transfer</li>
                <li>✓ <strong>Bank Transfer</strong> - Direct bank deposit</li>
                <li>✓ <strong>Contact Us</strong> - Other payment arrangements</li>
              </ul>
              <p className="mt-3 text-sm">
                For card payments or other payment methods, please{' '}
                <a href="mailto:donations@creativeroots.rw" className="underline">
                  email us
                </a>{' '}
                or contact us on WhatsApp at{' '}
                <a href="https://wa.me/250792505680" className="underline ml-1">
                  +250 792 505 680
                </a>
              </p>
            </div>
          </div>

          {donationMethod === 'momo' && (
            <p className="text-sm text-dark-charcoal mb-4">
              MTN MoMo account: <strong>{process.env.NEXT_PUBLIC_MOMO_ACCOUNT || ''}</strong>
            </p>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setDonationMethod('momo')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  donationMethod === 'momo'
                    ? 'bg-warm-brown text-cream'
                    : 'bg-gray-200 text-dark-charcoal hover:bg-gray-300'
                }`}
              >
                MTN MoMo
              </button>
              <button
                onClick={() => setDonationMethod('bank')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  donationMethod === 'bank'
                    ? 'bg-warm-brown text-cream'
                    : 'bg-gray-200 text-dark-charcoal hover:bg-gray-300'
                }`}
              >
                Bank Transfer
              </button>
              <button
                onClick={() => setDonationMethod('contact')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  donationMethod === 'contact'
                    ? 'bg-warm-brown text-cream'
                    : 'bg-gray-200 text-dark-charcoal hover:bg-gray-300'
                }`}
              >
                Contact Us
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (donationMethod === 'momo') {
                  handleMoMoSubmit(e);
                } else if (donationMethod === 'bank') {
                  handleBankTransferClick();
                } else {
                  handleContactClick();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Full Name</label>
                <input
                  type="text"
                  name="donor_name"
                  value={formData.donor_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Email (Optional)</label>
                <input
                  type="email"
                  name="donor_email"
                  value={formData.donor_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="donor_phone"
                  value={formData.donor_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="+250712345678"
                />
              </div>

              {donationMethod !== 'contact' && (
                <div>
                  <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                    Amount (RWF)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                    placeholder="10000"
                  />
                </div>
              )}

              {message && (
                <div
                  className={`p-4 rounded text-sm whitespace-pre-line ${
                    message.startsWith('✓')
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-warm-brown text-cream py-3 rounded-lg font-semibold hover:bg-orange-900 transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing...' : `Donate via ${donationMethod === 'momo' ? 'MTN MoMo' : donationMethod === 'bank' ? 'Bank' : 'Contact'}`}
              </button>
            </form>
          </div>

          <div className="bg-soft-gold/20 border-l-4 border-warm-brown p-6 rounded">
            <h3 className="font-bold text-warm-brown mb-2">Thank You for Your Support!</h3>
            <p className="text-gray-700 text-sm">
              Your donation makes a direct impact on our community. Every fund helps us continue our mission of
              empowering creative talents across Rwanda.
            </p>
          </div>
      </Section>

      <Footer />
    </>
  );
}

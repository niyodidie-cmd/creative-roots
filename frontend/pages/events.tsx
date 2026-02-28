import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  attendees: number;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setBookingLoading(true);
    setBookingMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          eventId: selectedEvent._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingMessage('✓ Booking successful! Confirmation email sent.');
        setBookingForm({ name: '', email: '', phone: '', attendees: 1 });
        setTimeout(() => {
          setSelectedEvent(null);
          setBookingMessage('');
        }, 3000);
      } else {
        setBookingMessage(`✗ ${data.error || 'Booking failed'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingMessage('✗ Error submitting booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Events | Creative Roots Rwanda</title>
        <meta name="description" content="View upcoming events organized by Creative Roots Rwanda" />
      </Head>

      <Navbar />

      <section className="pt-32 pb-20 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-warm-brown mb-12">Upcoming Events</h1>

          {loading ? (
            <div className="text-center text-lg text-dark-charcoal">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-lg text-dark-charcoal">No events available at the moment.</div>
          ) : (
            <div className="grid gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h3 className="text-2xl font-bold text-warm-brown mb-2">{event.title}</h3>
                  <p className="text-dark-charcoal mb-4">{event.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                    <div>
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Location:</strong> {event.location}
                    </div>
                    <div>
                      <strong>Capacity:</strong> {event.capacity} attendees
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="bg-warm-brown text-cream px-6 py-2 rounded-lg hover:bg-orange-900 transition font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-warm-brown mb-6">Book Event</h2>
            <p className="text-gray-700 mb-6">
              <strong>{selectedEvent.title}</strong> - {new Date(selectedEvent.date).toLocaleDateString()}
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Full Name</label>
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Email</label>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Phone</label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                  placeholder="+250712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">Number of Attendees</label>
                <input
                  type="number"
                  value={bookingForm.attendees}
                  onChange={(e) => setBookingForm({ ...bookingForm, attendees: parseInt(e.target.value) })}
                  required
                  min="1"
                  max={selectedEvent.capacity}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-brown"
                />
              </div>

              {bookingMessage && (
                <div
                  className={`p-3 rounded text-sm ${
                    bookingMessage.startsWith('✓')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {bookingMessage}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-warm-brown text-cream py-2 rounded-lg hover:bg-orange-900 transition font-semibold disabled:opacity-50"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 bg-gray-300 text-dark-charcoal py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';
import { BookingForm } from '@components/forms/BookingForm';

const events = [
  { title: 'Rwanda Story Trail', badge: 'Featured', description: 'A premium cultural exploration through local storytelling and arts experiences.', date: 'June 21, 2026' },
  { title: 'Youth Creative Summit', badge: 'Capacity 80', description: 'Workshops, panels and immersive training for emerging cultural leaders.', date: 'July 14, 2026' }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading title="Events & bookings" description="Discover upcoming experiences and request access to workshops, tours and storytelling programs." />
        <div className="grid gap-8 lg:grid-cols-2">
          {events.map((event) => (
            <div key={event.title} className="rounded-3xl border border-white/10 bg-[#091226] p-8 shadow-cinematic">
              <div className="flex items-center justify-between">
                <p className="inline-flex rounded-full bg-gold/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold">{event.badge}</p>
                <p className="text-sm text-sand/70">{event.date}</p>
              </div>
              <h3 className="mt-6 text-3xl font-semibold text-white">{event.title}</h3>
              <p className="mt-4 text-sand/80 leading-7">{event.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-3xl border border-white/10 bg-[#0c1625] p-10 shadow-cinematic">
          <h2 className="text-3xl font-semibold text-white">Book a seat or request a service</h2>
          <p className="mt-4 max-w-2xl text-sand/80 leading-7">Send a booking request and our team will follow up with confirmation, support, and program details.</p>
          <BookingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

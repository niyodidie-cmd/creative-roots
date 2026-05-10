import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';
import { ContactForm } from '@components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="Contact us" description="Reach out for bookings, partnerships, media requests or creative collaboration." />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#091124] p-10 shadow-cinematic">
            <p className="text-sand/80 leading-8">Email: hello@inkingi.rw</p>
            <p className="mt-3 text-sand/80 leading-8">Phone: +250 788 123 456</p>
            <p className="mt-8 text-sand/80 leading-8">Address: Kigali, Rwanda — a cultural hub for creative tourism and youth programs.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#091124] p-10 shadow-cinematic">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

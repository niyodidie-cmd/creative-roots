import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeading } from '@components/ui/SectionHeading';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

const events = [
  { title: 'Culture Caravan', date: 'June 21, 2026', description: 'A storytelling festival with youth-led performances and heritage tours.' },
  { title: 'Creative Labs', date: 'July 14, 2026', description: 'An interactive workshop for filmmakers, designers and storytellers.' }
];

const testimonials = [
  { quote: 'INKINGI changed the way our village sees creativity as a source of resilience.', author: 'Amina, creative entrepreneur' },
  { quote: 'The youth program gave me a platform to tell our story to the world.', author: 'Eric, storyteller' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-ink text-sand">
      <Navbar />
      <main className="relative overflow-hidden">
        <section className="relative min-h-[90vh] bg-[radial-gradient(circle_at_top,_rgba(198,155,109,0.18),_transparent_35%),linear-gradient(180deg,#050816_0%,#0c1325_100%)] px-6 py-16 md:py-24">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-gold/10 via-transparent to-sand/0" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
            <div className="max-w-3xl space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Rwanda cultural innovation</p>
              <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">
                Transforming youth stories into unforgettable cultural journeys.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-sand/80">
                INKINGI Creative Hub connects artists, tourism, and community impact through cinematic experiences, powerful events and empowerment programs.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/events" className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300">
                  Explore events
                </Link>
                <Link href="/support" className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3 text-sand transition hover:border-gold">
                  Support our mission
                </Link>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {['Cultural tours', 'Youth programs', 'Creative storytelling'].map((item) => (
                <motion.div key={item} whileHover={{ y: -6 }} className="rounded-3xl border border-white/10 bg-[#101827]/90 p-8 shadow-cinematic">
                  <p className="text-sm uppercase tracking-[0.2em] text-gold">{item}</p>
                  <p className="mt-4 text-lg leading-7 text-sand/80">A premium experience designed to expand cultural visibility and creative impact.</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Impact in motion"
              description="From immersive events to youth training and storytelling campaigns, our work is rooted in measurable transformation."
            />
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { value: '120+', label: 'Events & activations' },
                { value: '850+', label: 'Youth reached' },
                { value: '32', label: 'Programs delivered' },
                { value: '14', label: 'Global partners' }
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-[#0d1529] p-8 shadow-cinematic">
                  <p className="text-4xl font-semibold text-white">{item.value}</p>
                  <p className="mt-4 text-sand/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#060a16] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title="Voice of impact" description="Hear from the young leaders, artists and partners whose lives were shaped by INKINGI." />
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((item) => (
                <motion.div key={item.author} whileHover={{ scale: 1.02 }} className="rounded-3xl border border-white/10 bg-[#11182f] p-10">
                  <p className="text-xl leading-9 text-sand">“{item.quote}”</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gold">{item.author}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gold">Upcoming experiences</p>
                <h2 className="text-4xl font-semibold text-white">Curated cultural events</h2>
              </div>
              <Link href="/events" className="rounded-full border border-white/10 px-5 py-3 text-sm hover:border-gold">
                View all events
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {events.map((event) => (
                <motion.div key={event.title} whileHover={{ y: -6 }} className="rounded-3xl border border-white/10 bg-[#0b1323] p-10 shadow-cinematic">
                  <p className="text-sm uppercase tracking-[0.3em] text-gold">{event.date}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-4 text-sand/80 leading-7">{event.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#050814] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {['Visual storytelling', 'Community gallery', 'Media library'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-[#111827] p-10">
                  <p className="text-sm uppercase tracking-[0.3em] text-gold">{item}</p>
                  <p className="mt-4 text-sand/80 leading-7">A growing archive of cultural media, crafted for global audiences and premium cultural tourism.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[#0b1222]/95 p-12 shadow-cinematic">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-semibold text-white">Join the movement</h2>
                <p className="mt-4 text-sand/80 leading-8">Sign up for impact updates, event invitations and storytelling showcases from Rwanda’s leading creative tech hub.</p>
              </div>
              <form action="/api/messages" method="post" className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-sand/70">Name</label>
                  <input id="name" name="name" required className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0d1224] px-4 py-3 text-sand outline-none focus:border-gold" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-sand/70">Email</label>
                  <input id="email" name="email" type="email" required className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0d1224] px-4 py-3 text-sand outline-none focus:border-gold" />
                </div>
                <button type="submit" className="rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300">Subscribe now</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

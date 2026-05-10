import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import Link from 'next/link';
import { SectionHeading } from '@components/ui/SectionHeading';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="Support the hub" description="Together we can scale creative tourism, youth empowerment and local storytelling in Rwanda." />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#091124] p-10 shadow-cinematic">
            <h3 className="text-2xl font-semibold text-white">Donate</h3>
            <p className="mt-4 text-sand/80 leading-7">Your contribution fuels programs, event logistics and storytelling initiatives for youth across Rwanda.</p>
            <Link href="/contact" className="mt-8 inline-flex rounded-full bg-gold px-8 py-3 text-ink transition hover:bg-yellow-300">
              Contact for donation
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#091124] p-10 shadow-cinematic">
            <h3 className="text-2xl font-semibold text-white">Partner</h3>
            <p className="mt-4 text-sand/80 leading-7">Become a sponsorship partner and co-create impact journeys, heritage experiences and youth leadership opportunities.</p>
            <Link href="/contact" className="mt-8 inline-flex rounded-full border border-white/10 px-8 py-3 text-sand transition hover:border-gold">
              Start partnership
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

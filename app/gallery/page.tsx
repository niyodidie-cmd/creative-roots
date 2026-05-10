import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';

const gallery = [
  { title: 'Performance', caption: 'Live storytelling and cultural theatre.' },
  { title: 'Heritage', caption: 'Places, ceremonies, and community rituals.' },
  { title: 'Youth', caption: 'Artists shaping tomorrow through creativity.' },
  { title: 'Tourism', caption: 'Premium experiences rooted in Rwandan identity.' }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="Gallery" description="A visual archive of performances, programs and community events shaped by INKINGI." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1223] p-8 transition hover:-translate-y-1">
              <div className="h-40 rounded-3xl bg-gradient-to-br from-gold/20 via-transparent to-ink" />
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sand/80 leading-7">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

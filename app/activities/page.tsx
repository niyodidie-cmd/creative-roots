import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';

const activities = [
  { title: 'Storytelling residencies', description: 'Long-term creative support for youth filmmakers and writers.' },
  { title: 'Media production', description: 'Professional photography, film and digital campaigns with cultural resonance.' },
  { title: 'Heritage tours', description: 'Premium cultural routes and community-led tourism journeys.' },
  { title: 'Creative incubation', description: 'Business support for cultural entrepreneurs and social innovators.' }
];

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="Core activities" description="A portfolio of programs that combine creative craft, cultural education and growth for young leaders." />
        <div className="grid gap-8 md:grid-cols-2">
          {activities.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-[#08101d] p-10 shadow-cinematic">
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sand/80 leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

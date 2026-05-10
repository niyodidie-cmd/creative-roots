import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';

const stories = [
  { title: 'From Kigali to the world', summary: 'A youth film collective turned community tour company after INKINGI mentorship.' },
  { title: 'Harvesting heritage', summary: 'A storytelling residency that amplified traditional dancers and cultural ambassadors.' },
  { title: 'Tech for tourism', summary: 'A digital campaign that attracted international guests to local heritage sites.' }
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="Stories of transformation" description="Impact narratives from the creative makers, youth leaders and cultural partners behind INKINGI." />
        <div className="grid gap-8 lg:grid-cols-3">
          {stories.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-[#09111f] p-8 shadow-cinematic">
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sand/80 leading-7">{item.summary}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

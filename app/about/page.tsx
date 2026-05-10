import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { SectionHeading } from '@components/ui/SectionHeading';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading title="About INKINGI" description="A center for creative excellence, cultural tourism and youth-led storytelling rooted in Rwanda’s heritage." />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#091024] p-10 shadow-cinematic">
            <h2 className="text-3xl font-semibold text-white">Our mission</h2>
            <p className="mt-6 leading-8 text-sand/80">
              We activate local stories, creative services and cultural experiences that position Rwanda as a premium destination for art, tourism and social innovation.
            </p>
            <p className="mt-4 leading-8 text-sand/80">
              Through training, events and immersive productions, we create pathways for youth empowerment and authentic cultural representation.
            </p>
          </div>
          <div className="space-y-8">
            {[
              { title: 'Creative labs', description: 'Training workshops that develop storytellers, designers and tourism ambassadors.' },
              { title: 'Cultural tours', description: 'Curated experiences that connect international guests with local heritage and artistry.' },
              { title: 'Impact partnerships', description: 'Collaborations that amplify community-led initiatives and sustainable empowerment.' }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-[#0d1324] p-8">
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sand/80 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Creative Roots Rwanda</title>
        <meta name="description" content="Learn about Creative Roots Rwanda organization" />
      </Head>

      <Navbar />

      <section className="w-full bg-cream py-12">
        <div className="w-full px-6">
          <h1 className="text-4xl font-bold text-warm-brown mb-8 text-center">About Creative Roots Rwanda</h1>

          <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-3xl font-bold text-warm-brown mb-6 p-6 text-center">Who We Are</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div className="flex items-center justify-center">
                <img src="/images/hero/about-who-we-are.jpg" alt="Creative Roots Team" className="w-full h-auto rounded-lg object-cover" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-lg text-dark-charcoal">
                  Founded by NIYOMUKIZA Didier, Creative Roots Rwanda is a grassroots creative
                  initiative born from the passion to unlock potential in Rwandan youth. We
                  operate as a 100% volunteer-led organization, demonstrating that transformative
                  change doesn&apos;t require institutional overhead—it requires heart, dedication,
                  and belief in people.
                </p>
                <p className="text-lg text-dark-charcoal">
                  We work with young people aged 10–30, in and out of school, creating safe
                  spaces where art becomes a tool for self-discovery, confidence building, and
                  community engagement. Whether through sculpture, painting, or personal
                  storytelling, we help young people find their voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="max-w-7xl mx-auto space-y-12 px-6">
          <div>
            <h2 className="text-3xl font-bold text-warm-brown mb-4">Our Mission</h2>
            <p className="text-lg text-dark-charcoal">
              To empower youth in Rwanda to discover, develop, and express their
              creative talents through accessible art and storytelling, fostering
              confidence, cultural pride, and community belonging.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-warm-brown mb-4">Our Vision</h2>
            <p className="text-lg text-dark-charcoal">
              A Rwanda where every young person—regardless of background or schooling
              status—sees themselves as a creative force capable of shaping their
              community and future through art.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/contact" className="inline-block bg-warm-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-orange-900 transition">
            Get Involved / Contact Us
          </Link>
        </div>
      </Section>

      <Footer />
    </>
  );
}

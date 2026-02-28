import Head from 'next/head';
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

      <Section className="bg-cream">
        <h1 className="text-4xl font-bold text-warm-brown mb-12 text-center">
          About Creative Roots Rwanda</h1>

        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-warm-brown mb-4">Who We Are</h2>
            <p className="text-lg text-dark-charcoal mb-4">
              Founded by NIYOMUKIZA Didier, Creative Roots Rwanda is a grassroots creative
              initiative born from the passion to unlock potential in Rwandan youth. We
              operate as a 100% volunteer-led organization, demonstrating that transformative
              change doesn’t require institutional overhead—it requires heart, dedication,
              and belief in people.
            </p>
            <p className="text-lg text-dark-charcoal">
              We work with young people aged 10–30, in and out of school, creating safe
              spaces where art becomes a tool for self-discovery, confidence building, and
              community engagement.
            <h2 className="text-3xl font-bold text-warm-brown mb-4">Our Mission</h2>
            <p className="text-lg text-dark-charcoal">
              To offer authentic, eco-friendly lodging and tours that connect visitors with
              Rwanda’s natural beauty and vibrant communities, while generating meaningful
              economic opportunities for residents.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-warm-brown mb-4">Our Vision</h2>
            <p className="text-lg text-dark-charcoal">
              To be the leading sustainable tourism destination in Northern Rwanda—a place
              where every journey inspires respect for nature and fosters lasting community
              impact.
            </p>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}

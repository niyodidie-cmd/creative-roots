import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function WhoWeAre() {
  return (
    <>
      <Head>
        <title>Who We Are | Creative Roots Rwanda</title>
        <meta name="description" content="Learn about Creative Roots Rwanda organization and our mission" />
      </Head>

      <Navbar />

      <section className="w-full bg-cream py-12">
        <div className="w-full px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link href="/about" className="text-soft-gold hover:text-warm-brown transition">
                ← Back to About
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-warm-brown mb-8 text-center">Who We Are</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="flex items-center justify-center">
                  <img src="/images/hero/about-who-we-are.jpg" alt="Creative Roots Team" className="w-full h-auto rounded-lg object-cover max-h-96" />
                </div>
                <div className="flex flex-col justify-center space-y-6">
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
                  <p className="text-lg text-dark-charcoal">
                    Our programs are designed to be accessible and inclusive, reaching youth
                    from diverse backgrounds and circumstances. We believe that creativity is
                    universal and that every young person deserves the opportunity to explore
                    their artistic potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function Founder() {
  return (
    <>
      <Head>
        <title>Our Founder | Creative Roots Rwanda</title>
        <meta name="description" content="Meet NIYOMUKIZA Didier, founder of Creative Roots Rwanda" />
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

            <h1 className="text-4xl font-bold text-warm-brown mb-8 text-center">Our Founder</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="flex flex-col justify-center space-y-6">
                  <h2 className="text-2xl font-bold text-warm-brown">NIYOMUKIZA Didier</h2>
                  <p className="text-lg text-dark-charcoal">
                    NIYOMUKIZA Didier is the visionary founder of Creative Roots Rwanda, a
                    passionate advocate for youth empowerment through artistic expression.
                    With a background in technology and community development, Didier
                    recognized the transformative power of art in addressing social challenges
                    facing Rwandan youth.
                  </p>
                  <p className="text-lg text-dark-charcoal">
                    His journey began with a simple belief: that every young person deserves
                    the opportunity to discover their creative potential. This conviction led
                    him to establish Creative Roots Rwanda as a volunteer-led organization
                    that operates on the principle that meaningful change comes from within
                    communities, not from external institutions.
                  </p>
                  <p className="text-lg text-dark-charcoal">
                    Didier&apos;s approach combines traditional Rwandan values with modern
                    educational methods, creating programs that are culturally relevant and
                    practically effective. His leadership has inspired countless young people
                    to pursue their artistic passions and contribute positively to their
                    communities.
                  </p>
                  <blockquote className="border-l-4 border-soft-gold pl-4 italic text-dark-charcoal">
                    &ldquo;Art is not just about creating beautiful things—it&apos;s about creating
                    beautiful lives. When young people find their creative voice, they
                    find their power to shape their future and their community.&rdquo;
                  </blockquote>
                </div>
                <div className="flex items-center justify-center">
                  <img src="/images/founder.jpg" alt="NIYOMUKIZA Didier" className="w-full h-auto rounded-lg object-cover max-h-96" onError={(e) => {
                    e.currentTarget.src = '/images/hero/about-who-we-are.jpg';
                  }} />
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
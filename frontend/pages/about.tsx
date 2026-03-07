import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/about/who-we-are" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block">
              <h3 className="text-xl font-bold text-warm-brown mb-4">Who We Are</h3>
              <p className="text-dark-charcoal mb-4">Learn about our organization and the people behind Creative Roots Rwanda.</p>
              <span className="text-soft-gold font-semibold">Read more →</span>
            </Link>

            <Link href="/about/mission" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block">
              <h3 className="text-xl font-bold text-warm-brown mb-4">Our Mission</h3>
              <p className="text-dark-charcoal mb-4">Discover our commitment to empowering Rwandan youth through art and creativity.</p>
              <span className="text-soft-gold font-semibold">Read more →</span>
            </Link>

            <Link href="/about/vision" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block">
              <h3 className="text-xl font-bold text-warm-brown mb-4">Our Vision</h3>
              <p className="text-dark-charcoal mb-4">See the future we envision for creative expression in Rwanda.</p>
              <span className="text-soft-gold font-semibold">Read more →</span>
            </Link>

            <Link href="/about/founder" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block">
              <h3 className="text-xl font-bold text-warm-brown mb-4">Our Founder</h3>
              <p className="text-dark-charcoal mb-4">Meet NIYOMUKIZA Didier, the visionary behind Creative Roots Rwanda.</p>
              <span className="text-soft-gold font-semibold">Read more →</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

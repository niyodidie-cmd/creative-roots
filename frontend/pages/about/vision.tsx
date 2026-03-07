import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function Vision() {
  return (
    <>
      <Head>
        <title>Our Vision | Creative Roots Rwanda</title>
        <meta name="description" content="Discover our vision for the future of creative expression in Rwanda" />
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

            <h1 className="text-4xl font-bold text-warm-brown mb-8 text-center">Our Vision</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="flex items-center justify-center">
                  <img src="/images/hero/vision.jpg" alt="Our Vision" className="w-full h-auto rounded-lg object-cover max-h-96" onError={(e) => {
                    e.currentTarget.src = '/images/hero/about-who-we-are.jpg';
                  }} />
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <p className="text-lg text-dark-charcoal">
                    We envision a Rwanda where every young person has access to creative expression
                    as a fundamental right. A nation where art is integrated into education, community
                    development, and economic growth, creating a vibrant cultural landscape that
                    inspires innovation and preserves heritage.
                  </p>
                  <p className="text-lg text-dark-charcoal">
                    Our vision includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-lg text-dark-charcoal ml-4">
                    <li>A nationwide network of creative hubs and art centers</li>
                    <li>Art education integrated into school curricula</li>
                    <li>Youth-led creative enterprises and cooperatives</li>
                    <li>International recognition of Rwandan artistic innovation</li>
                    <li>A society where creativity drives social and economic development</li>
                  </ul>
                  <p className="text-lg text-dark-charcoal">
                    We see Creative Roots Rwanda growing from a grassroots initiative into a
                    national movement that transforms how Rwandans view art, creativity, and
                    youth potential. Our vision is ambitious, but our approach remains rooted
                    in the communities we serve.
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
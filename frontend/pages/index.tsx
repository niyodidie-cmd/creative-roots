import Head from 'next/head';
import Navbar from '@components/Navbar';
import HeroSlideshow from '@components/HeroSlideshow';
import Footer from '@components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Creative Roots Rwanda | Art & Stories for All</title>
        <meta name="description" content="Empowering youth through art, sculpture, and storytelling" />
      </Head>

      <Navbar />
      <HeroSlideshow />

      <section className="pt-20 pb-20 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-warm-brown mb-6">Our Mission</h2>
          <p className="text-lg text-dark-charcoal mb-4">
            Art & Stories for All is empowering youth and out-of-school individuals to discover and express 
            their hidden talents through art, sculpture, and storytelling.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

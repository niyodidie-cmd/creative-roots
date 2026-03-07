import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function Mission() {
  return (
    <>
      <Head>
        <title>Our Mission | Creative Roots Rwanda</title>
        <meta name="description" content="Learn about our mission to empower Rwandan youth through art and creativity" />
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

            <h1 className="text-4xl font-bold text-warm-brown mb-8 text-center">Our Mission</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="flex flex-col justify-center space-y-6">
                  <p className="text-lg text-dark-charcoal">
                    Our mission is to empower Rwandan youth through artistic expression and creative
                    exploration. We believe that art is not just a form of entertainment, but a
                    powerful tool for personal growth, community building, and social change.
                  </p>
                  <p className="text-lg text-dark-charcoal">
                    We provide comprehensive art education and mentorship programs that help young
                    people develop their creative skills while building confidence, resilience, and
                    leadership abilities. Our approach combines traditional Rwandan artistic
                    techniques with contemporary methods to create a unique cultural fusion.
                  </p>
                  <p className="text-lg text-dark-charcoal">
                    Through our programs, we aim to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-lg text-dark-charcoal ml-4">
                    <li>Foster creativity and artistic expression</li>
                    <li>Build self-confidence and personal development</li>
                    <li>Promote cultural preservation and innovation</li>
                    <li>Create opportunities for youth engagement</li>
                    <li>Strengthen community bonds through shared creative experiences</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <img src="/images/hero/mission.jpg" alt="Our Mission" className="w-full h-auto rounded-lg object-cover max-h-96" onError={(e) => {
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
import Head from 'next/head';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Section from '@components/Section';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Creative Roots Rwanda</title>
        <meta name="description" content="Get in touch with Creative Roots Rwanda" />
      </Head>

      <Navbar />

      <Section className="bg-cream min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-warm-brown mb-6">Contact Us</h1>
          <p className="text-lg text-dark-charcoal mb-8">
            For inquiries, volunteer follow-up, and donation confirmation, please use the dedicated pages:
          </p>
          <div className="space-y-3">
            <p>Volunteer: fill the “Ready to Join Us?” form on the homepage</p>
            <p>Donate: visit the Donate page</p>
            <p>
              General support: <a href="mailto:info@creativeroots.rw" className="underline">info@creativeroots.rw</a> | WhatsApp: +250 792 505 680
            </p>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}

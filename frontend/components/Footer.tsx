/* eslint-disable @next/next/no-html-link-for-pages */
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-charcoal text-cream py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-soft-gold mb-4">Creative Roots Rwanda</h3>
            <p className="text-sm text-gray-300">
              Empowering youth through art, sculpture, and storytelling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-soft-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-soft-gold transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-soft-gold transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-soft-gold transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-soft-gold transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-soft-gold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/donate" className="hover:text-soft-gold transition">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-soft-gold transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-soft-gold transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-soft-gold mb-4">Contact</h4>
            <p className="text-sm mb-2">
              Email:{' '}
              <a href="mailto:info@creativeroots.rw" className="hover:text-soft-gold transition">
                info@creativeroots.rw
              </a>
            </p>
            <p className="text-sm mb-2">
              Phone:{' '}
              <a href="tel:+250792505680" className="hover:text-soft-gold transition">
                +250 792 505 680
              </a>
            </p>
            <p className="text-sm">
              Follow us on{' '}
              <a href="https://instagram.com/creativerootsRW" target="_blank" className="underline hover:text-soft-gold">
                Instagram (@creativerootsRW)
              </a>{' '}
              and{' '}
              <a href="https://facebook.com/creativerootsRW" target="_blank" className="underline hover:text-soft-gold">
                Facebook
              </a>.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Creative Roots Rwanda. All rights reserved. | Founded by NIYOMUKIZA Didier
          </p>
        </div>
      </div>
    </footer>
  );
}

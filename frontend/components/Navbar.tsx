import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Persist language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <nav className="fixed top-0 w-full bg-cream/98 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 h-nav-height flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img src="/images/logo.png" alt="Creative Roots" className="h-14 w-14" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <Link href="/" className="text-dark-charcoal hover:text-warm-brown transition">
              Home
            </Link>
          </li>
          <li className="relative group">
            <button className="text-dark-charcoal hover:text-warm-brown transition">
              About Us
            </button>
            <ul className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li>
                <Link href="/about" className="block px-4 py-2 hover:bg-cream">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href="/about#mission" className="block px-4 py-2 hover:bg-cream">
                  Mission & Vision
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/events" className="text-dark-charcoal hover:text-warm-brown transition">
              Events
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="text-dark-charcoal hover:text-warm-brown transition">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-dark-charcoal hover:text-warm-brown transition">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/donate" className="bg-warm-brown text-cream px-4 py-2 rounded-lg hover:bg-orange-900 transition">
              Donate
            </Link>
          </li>
          <li className="flex gap-2 border-l border-gray-300 pl-4 items-center">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`font-semibold ${
                language === 'en' ? 'text-warm-brown' : 'text-gray-500 hover:text-dark-charcoal'
              }`}
            >
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`font-semibold ${
                language === 'fr' ? 'text-warm-brown' : 'text-gray-500 hover:text-dark-charcoal'
              }`}
            >
              FR
            </button>
            <span className="text-gray-300 mx-1">•</span>
            <Link href="/secure-admin-login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-dark-charcoal font-bold transition shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 2a2 2 0 100 4 2 2 0 000-4zm0 8a5 5 0 00-4.546 2.664A5.99 5.99 0 0012 20a5.99 5.99 0 004.546-2.336A5 5 0 0012 14z" />
              </svg>
              Admin
            </Link>
          </li>
        </ul>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl text-warm-brown"
        >
          ☰
        </button>
        {/* Admin corner icon for desktop - positioned right after donate button */}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="md:hidden bg-white shadow-lg">
          <li>
            <Link href="/" className="block px-6 py-3 hover:bg-cream">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block px-6 py-3 hover:bg-cream">
              About
            </Link>
          </li>
          <li>
            <Link href="/events" className="block px-6 py-3 hover:bg-cream">
              Events
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="block px-6 py-3 hover:bg-cream">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block px-6 py-3 hover:bg-cream">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/donate" className="block px-6 py-3 bg-warm-brown text-cream font-semibold">
              Donate
            </Link>
          </li>
          <li>
            <Link href="/secure-admin-login" className="block px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-dark-charcoal font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 2a2 2 0 100 4 2 2 0 000-4zm0 8a5 5 0 00-4.546 2.664A5.99 5.99 0 0012 20a5.99 5.99 0 004.546-2.336A5 5 0 0012 14z" />
              </svg>
              Admin Login
            </Link>
          </li>
        </ul>
      )}
      {/* Floating admin button: always visible top-right */}
      <Link
        href="/secure-admin-login"
        title="Admin login"
        aria-label="Admin login"
        className="fixed right-4 top-4 md:right-6 md:top-6 z-50 bg-yellow-400 hover:bg-yellow-500 text-dark-charcoal rounded-full p-3 shadow-xl flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16z" />
        </svg>
      </Link>
    </nav>
  );
}

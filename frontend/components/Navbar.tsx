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
            <Link href="/secure-admin-login" className="text-sm text-dark-charcoal hover:text-warm-brown transition font-medium flex items-center gap-1 bg-gray-200 hover:bg-gray-300 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
        {/* Admin corner icon for desktop */}
        <Link
          href="/secure-admin-login"
          className="hidden md:flex items-center gap-1 absolute right-6 top-3 text-sm text-dark-charcoal hover:text-warm-brown bg-gray-200 p-1 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
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
            <Link href="/secure-admin-login" className="block px-6 py-3 hover:bg-cream text-sm text-dark-charcoal flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Login
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

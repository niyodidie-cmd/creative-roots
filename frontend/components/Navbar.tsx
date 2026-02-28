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
          <img src="/logo.svg" alt="Creative Roots Rwanda" className="h-10 w-10" />
          <span className="font-bold text-xl text-warm-brown hidden sm:inline">Creative Roots</span>
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
          <li>
            <Link href="/secure-admin-login" className="text-sm text-dark-charcoal hover:text-warm-brown transition ml-4">
              Admin
            </Link>
          </li>
          <li className="flex gap-2 border-l border-gray-300 pl-4">
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
          </li>
        </ul>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl text-warm-brown"
        >
          ☰
        </button>
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
        </ul>
      )}
    </nav>
  );
}

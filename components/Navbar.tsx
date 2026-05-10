'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Activities', href: '/activities' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Stories', href: '/stories' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' }
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const userRole = (session?.user as any)?.role;

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-ink/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sand">
        <Link href="/" className="text-xl font-semibold tracking-widest text-gold">
          INKINGI
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${pathname === item.href ? 'text-gold' : 'text-sand/80 hover:text-sand'}`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-white/10 px-4 py-2 text-sm"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {session?.user ? (
            <Link href={userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? '/dashboard/admin' : '/dashboard/user'} className="rounded-full bg-gold px-5 py-2 text-ink transition hover:bg-yellow-400">
              Dashboard
            </Link>
          ) : (
            <button onClick={() => signIn('credentials')} className="rounded-full border border-white/10 px-5 py-2 text-sm transition hover:border-gold hover:text-gold">
              Login
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-sand md:hidden"
        >
          <span className="text-lg">☰</span>
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-white/10 bg-ink/95 px-6 pb-4 md:hidden">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={`block px-2 py-3 text-lg ${pathname === item.href ? 'text-gold' : 'text-sand/70'}`}> {item.label}</Link>
          ))}
          <div className="mt-3 flex flex-col gap-3">
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-white/10 px-4 py-2 text-left">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {session?.user ? (
              <Link href={userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? '/dashboard/admin' : '/dashboard/user'} className="rounded-full bg-gold px-4 py-2 text-ink text-center">
                Dashboard
              </Link>
            ) : (
              <button onClick={() => signIn('credentials')} className="rounded-full border border-white/10 px-4 py-2 text-left">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}

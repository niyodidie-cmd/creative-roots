import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040812] px-6 py-12 text-sand/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-gold">INKINGI CREATIVE HUB</p>
          <p className="max-w-md text-sm leading-6">
            Building culture, solidarity, and youth impact through immersive storytelling, events, and tourism experiences in Rwanda.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <Link href="/about" className="block hover:text-sand">About</Link>
          <Link href="/contact" className="block hover:text-sand">Contact</Link>
          <Link href="/support" className="block hover:text-sand">Support</Link>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-sand/50">© {new Date().getFullYear()} INKINGI CREATIVE HUB. Crafted for cultural impact and global storytelling.</p>
    </footer>
  );
}

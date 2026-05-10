import type { Metadata } from 'next';
import '@styles/globals.css';
import { Providers } from '@components/Providers';

export const metadata: Metadata = {
  title: 'INKINGI Creative Hub',
  description: 'A global creative-tech platform for Rwanda storytelling, youth empowerment and cultural tourism.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-ink text-sand antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

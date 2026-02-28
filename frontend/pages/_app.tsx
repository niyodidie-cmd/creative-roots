import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    // Initialize any global state/auth here
    console.log('App initialized');
  }, []);

  return <Component {...pageProps} />;
}

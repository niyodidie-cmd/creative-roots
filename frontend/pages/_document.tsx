import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Creative Roots Rwanda - Art & Stories for All. Empowering youth through art, sculpture, and storytelling."
        />
        <meta name="author" content="NIYOMUKIZA Didier" />
         <link rel="shortcut icon" href="/images/logo.svg" type="image/svg+xml" />
      </Head>
      <body className="bg-cream text-dark-charcoal">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

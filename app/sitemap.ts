import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const pages = ['/', '/about', '/activities', '/gallery', '/events', '/stories', '/support', '/contact', '/auth/login', '/auth/register', '/auth/forgot-password'];

const sitemap = (): MetadataRoute.Sitemap => {
  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date()
  }));
};

export default sitemap;

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/cdn-cgi/', '/api/'],
      },
    ],
    sitemap: 'https://splicestudio.fr/sitemap.xml',
  }
}

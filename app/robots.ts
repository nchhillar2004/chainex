import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: 'Googlebot',
                allow: ['/', '/c/', '/t/', '/u/', '/about/', '/privacy/'],
                disallow: ['/auth/', '/create/', '/new/'],
            },
            {
                userAgent: ['Applebot', 'Bingbot'],
                disallow: ['/'],
            },
        ],
        sitemap: 'https://acme.com/sitemap.xml',
    }
}

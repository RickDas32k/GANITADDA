import { MetadataRoute } from 'next';
import { getWorksheets } from '@/lib/worksheets';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ganit-adda.vercel.app';
  const worksheets = await getWorksheets();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/worksheets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ncert-solutions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/study-materials`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mock-tests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/shipping-and-delivery`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const worksheetPages: MetadataRoute.Sitemap = worksheets.map((ws) => ({
    url: `${baseUrl}/worksheets/${ws.slug || ws.id}`,
    lastModified: new Date(ws.updated_at || ws.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...worksheetPages];
}

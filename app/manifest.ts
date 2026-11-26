import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GANIT ADDA',
    short_name: 'Ganit Adda',
    description: 'CBSE & NCERT mathematics worksheets, solutions and mock tests for Classes VI–XII.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf6ed',
    theme_color: '#3e1022',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'GANIT ADDA | Premium CBSE & NCERT Mathematics Worksheets & Solutions',
  description:
    'Maths Made Simple, One Step at a Time. Explore expertly designed mathematics worksheets, chapter-wise practice materials, mock tests and step-by-step solutions for Classes VI through XII.',
  keywords: [
    'CBSE Mathematics Worksheets',
    'NCERT Maths Solutions',
    'Class 10 Maths Question Bank',
    'Class 12 Maths Integrals',
    'Ganit Adda',
    'Mathematics Practice Papers',
    'CBSE Board Exam Preparation',
  ],
  authors: [{ name: 'Ganit Adda' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ganit-adda.vercel.app'),
  openGraph: {
    title: 'GANIT ADDA | Maths Made Simple, One Step at a Time',
    description:
      'Curated NCERT & CBSE aligned mathematics worksheets, revision notes and worked step-by-step solutions for Classes VI to XII.',
    url: 'https://ganit-adda.vercel.app',
    siteName: 'GANIT ADDA',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <div style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</div>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import FloatingContact from '@/components/FloatingContact';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Networking Tours & Travels — Cabs, SUVs, Tempo Travellers in Bengaluru',
  description:
    'Book airport transfers, local rentals, outstation trips & tempo travellers in Bengaluru. Pay after your ride — cash or UPI to the driver. No advance payment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'optional' });

export const metadata: Metadata = {
  title: 'ClashDex – iOS Style Stats',
  description: 'Interface inspirada no iOS para estatísticas do Clash Royale'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans bg-neutral-950 text-white antialiased">{children}</body>
    </html>
  );
}
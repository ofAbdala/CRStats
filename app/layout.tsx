import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clash Dex - Elite Gaming Analytics by X1.Payments',
  description: 'Para jogadores que não aceitam menos que a perfeição. Analytics premium powered by X1.Payments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="h-full bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
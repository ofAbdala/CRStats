import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clash Royale Status',
  description: 'Dashboard de estatísticas do Clash Royale',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-[#0b0f1a] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
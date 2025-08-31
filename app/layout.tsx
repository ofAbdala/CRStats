import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clash Dex - X1.Payments',
  description: 'Dashboard profissional de estatísticas do Clash Royale by X1.Payments',
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
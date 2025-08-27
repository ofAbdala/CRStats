import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clash Royale Status',
  description: 'DeepLOL-style Clash Royale player stats (Supercell API)'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg-dark text-white">{children}</body>
    </html>
  );
}
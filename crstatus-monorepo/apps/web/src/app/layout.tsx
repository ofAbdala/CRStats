import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'CR Status - Clash Royale Analytics',
    description: 'Track your Clash Royale progress with advanced analytics and push session detection',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}

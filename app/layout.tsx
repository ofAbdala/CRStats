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
      {/* Use a stack de fontes do Tailwind (system) e tema dark */}
      <body className="h-full bg-[#0b0f1a] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">app/page.tsx</parameter>
<parameter name="old_str">async function fetchJson(url: string) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}</parameter>
<parameter name="new_str">async function fetchJson(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      // ignore silenciosamente (navegação/refresh pode cancelar fetch)
      return null;
    }
    throw e;
  }
}</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">tailwind.config.js</parameter>
<parameter name="old_str">/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // usa stack do sistema; não baixa nada da web
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'Noto Sans',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          royal: '#1a2a6c',
          gold: '#ffc857',
          ink: '#0b0f1a',
        },
        card: {
          dark: '#121929',
        },
        border: {
          dark: '#1f2a44',
        },
        royal: "#1E90FF",
        gold: "#FFD700",
        purple: "#8A2BE2",
        "bg-dark": "#080B12",
        "card-dark": "#0a0d14",
        "border-dark": "#1d2230",
      },
    },
  },
  plugins: [],
};</parameter>
<parameter name="new_str">/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // usa stack do sistema; não baixa nada da web
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'Noto Sans',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          royal: '#1a2a6c',
          gold: '#ffc857',
          ink: '#0b0f1a',
        },
        card: {
          dark: '#121929',
        },
        border: {
          dark: '#1f2a44',
        },
        royal: "#1E90FF",
        gold: "#FFD700",
        purple: "#8A2BE2",
        "bg-dark": "#080B12",
        "card-dark": "#0a0d14",
        "border-dark": "#1d2230",
      },
    },
  },
  plugins: [],
};</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">.env.local</parameter>
<parameter name="old_str"># Increase Google Fonts timeout to prevent AbortError
NEXT_FONT_GOOGLE_TIMEOUT=30000</parameter>
<parameter name="new_str"># Google Fonts disabled - using system fonts only</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">.env.example</parameter>
<parameter name="old_str"># Increase Google Fonts timeout to prevent AbortError
NEXT_FONT_GOOGLE_TIMEOUT=30000</parameter>
<parameter name="new_str"># Google Fonts disabled - using system fonts only</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">shell</parameter>
<parameter name="path">/home/project</parameter>
<parameter name="old_str">rm -rf .next</parameter>
<parameter name="new_str"></parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">shell</parameter>
<parameter name="path">/home/project</parameter>
<parameter name="old_str">npm install</parameter>
<parameter name="new_str"></parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">shell</parameter>
<parameter name="path">/home/project</parameter>
<parameter name="old_str">npm run dev</parameter>
<parameter name="new_str"></parameter>
</invoke>
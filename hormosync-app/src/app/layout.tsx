import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HormoSync – Seu Acompanhamento Hormonal Personalizado",
  description: "O app de acompanhamento hormonal mais personalizado do Brasil para mulheres na menopausa e pré-menopausa.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HormoSync",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0910",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Persist theme BEFORE paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('hs_theme');
                  if (t) document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <div style={{ maxWidth: '430px', margin: '0 auto', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./styles/globals.css";

import { Manrope } from "next/font/google";

import { AppSidebar } from "./components/navigation/AppSidebar";
import { SiteHeader } from "./components/navigation/SiteHeader";
import { Footer } from "./components/navigation/Footer";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  title: "RindeChile - Transparencia en Compras Municipales",
  description: "Plataforma dedicada a monitorear y promover la transparencia en las compras municipales en Chile.",
  metadataBase: new URL("https://rindechile.cl"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rindechile.cl",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://rindechile.cl",
    siteName: "RindeChile",
    title: "RindeChile - Transparencia en Compras Municipales",
    description: "Plataforma dedicada a monitorear y promover la transparencia en las compras municipales en Chile.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "RindeChile - Transparencia en Compras Municipales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RindeChile - Transparencia en Compras Municipales",
    description: "Plataforma dedicada a monitorear y promover la transparencia en las compras municipales en Chile.",
    images: ["/opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preload" href="/data/chile_regions.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${manrope.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "RindeChile",
                url: "https://rindechile.cl",
                logo: "https://rindechile.cl/logo-full.svg",
                description:
                  "Plataforma dedicada a monitorear y promover la transparencia en las compras municipales en Chile.",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "RindeChile",
                url: "https://rindechile.cl",
                description:
                  "Plataforma dedicada a monitorear y promover la transparencia en las compras municipales en Chile.",
                inLanguage: "es",
              },
            ]),
          }}
        />

        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        <div className="[--header-height:3.5rem]">
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar />
              <SidebarInset>
                <main id="main-content" className="flex-1 px-6 py-4 tablet:px-12 tablet:py-8" tabIndex={-1}>
                  {children}
                </main>

                <Footer />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}

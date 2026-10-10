import type { Metadata, Viewport } from "next";
import { Archivo, DM_Sans, Doto, Geist, Geist_Mono, Tiny5 } from "next/font/google";
import { PlayerDock } from "@/components/site/player-dock";
import { PlayerProvider } from "@/components/site/player-provider";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const tiny5 = Tiny5({ variable: "--font-tiny5", weight: "400", subsets: ["latin"] });
const doto = Doto({ variable: "--font-doto", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const description = "Bring tactile wheel controls to the web.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: SITE_NAME,
  description,
  openGraph: {
    title: SITE_NAME,
    description,
    siteName: SITE_NAME,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#eeede7",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${tiny5.variable} ${doto.variable} ${archivo.variable} ${dmSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <PlayerProvider>
          {children}
          <PlayerDock />
        </PlayerProvider>
      </body>
    </html>
  );
}

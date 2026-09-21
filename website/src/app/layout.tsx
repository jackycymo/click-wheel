import type { Metadata, Viewport } from "next";
import { Archivo, Doto, Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import { PlayerProvider } from "@/components/site/player-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pixelify = Pixelify_Sans({ variable: "--font-pixelify", subsets: ["latin"] });
const doto = Doto({ variable: "--font-doto", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Click Wheel",
  description: "An iPod-style click wheel component for React",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Runs before paint so the stored theme never flashes.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${pixelify.variable} ${doto.variable} ${archivo.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}

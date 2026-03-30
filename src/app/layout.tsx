import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zarga Gentlemen's Barber Shop | Sfax, Tunisie",
    template: "%s | Zarga Barbershop",
  },
  description:
    "Le barbier premium de Sfax. Coupes, barbe, rasage classique et forfaits par des maîtres barbiers. Réservez en ligne.",
  keywords: ["barbier sfax", "coupe cheveux sfax", "barbe sfax", "zarga barbershop"],
  openGraph: {
    title: "Zarga Gentlemen's Barber Shop | Sfax, Tunisie",
    description: "Le barbier premium de Sfax. Réservez en ligne.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-bg-main text-[#111111] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

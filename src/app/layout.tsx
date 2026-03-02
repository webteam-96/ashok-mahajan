import type { Metadata } from "next";
import { Sarala, PT_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ============================================================
   FONT CONFIGURATION
   Sarala: weights 400, 700 (available on Google Fonts)
   PT Sans: weights 400, 700 — body text
   ============================================================ */
const sarala = Sarala({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sarala",
  display: "swap",
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-sans",
  display: "swap",
});

/* ============================================================
   SITE METADATA
   ============================================================ */
export const metadata: Metadata = {
  title: {
    default: "Rtn. Ashok Mahajan - Past R.I. Director",
    template: "%s | Rtn. Ashok Mahajan",
  },
  description:
    "Official website of Rtn. Ashok Mahajan, Past Rotary International Director. Explore his journey, speeches, publications, awards, and humanitarian initiatives.",
  keywords: [
    "Ashok Mahajan",
    "Rotary International Director",
    "Past RI Director",
    "Rotary",
    "Humanitarian",
    "COVID India Task Force",
  ],
  authors: [{ name: "Rtn. Ashok Mahajan" }],
  creator: "Rtn. Ashok Mahajan",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rtn. Ashok Mahajan - Past R.I. Director",
    title: "Rtn. Ashok Mahajan - Past R.I. Director",
    description:
      "Official website of Rtn. Ashok Mahajan, Past Rotary International Director.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rtn. Ashok Mahajan - Past R.I. Director",
    description:
      "Official website of Rtn. Ashok Mahajan, Past Rotary International Director.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sarala.variable} ${ptSans.variable}`}>
      <body className={`${sarala.variable} ${ptSans.variable} antialiased`}>
        {/* Accessibility: skip navigation link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Header />

        <main id="main-content">{children}</main>

        <Footer />
      </body>
    </html>
  );
}

import "./globals.css";

import type { Metadata } from "next";
import { Rubik, Source_Sans_3 } from "next/font/google";

import { Header } from "@/components";

// Fonte do titulo
const fontRubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  // 400 = regular, 600 = semibold, 700 = bold, 800 = extrabold
});

// Fonte do texto
const fontSource_Sans_3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  // 400 = regular, 600 = semibold, 700 = bold, 800 = extrabold
});

export const metadata: Metadata = {
  title: "Poupa+",
  description: "Veja seus dados de economia e controle financeiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${fontRubik.variable} ${fontSource_Sans_3.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

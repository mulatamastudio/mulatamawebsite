import type { Metadata } from "next";
// Importing the Quicksand font from Google Fonts via next/font
import { Quicksand } from "next/font/google";
import "./globals.css";

// Initializing the Quicksand font loader with multiple weight options.
// This is a best practice for having Regular, Medium, and Bold variations available.
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // 400=Regular, 500=Medium, 700=Bold
  display: 'swap', // Ensures text is visible while the font is loading
});

// Updated metadata for a professional and relevant site identity
export const metadata: Metadata = {
  title: "Mulatama Studio | Creative & Digital Solutions",
  description: "Mulatama Studio specializes in creating impactful digital experiences through elegant design and precise development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Applying the Quicksand font's class name directly to the body */}
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}
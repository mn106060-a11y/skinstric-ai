import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Skinstric AI | Sophisticated Skincare",
  description: "AI-powered personalized skincare routine.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-[#1A1B1C] antialiased selection:bg-[#1A1B1C] selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors position="bottom-right" />
          {/* Phase 2 (AI Chatbot): Global floating Chat UI component will be injected here */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import PageAnimatePresence from "@/components/layout/PageAnimatePresence";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";

export const metadata: Metadata = {
  title: "HiAnime Clone",
  description: "Watch anime online in high quality",
};

export const viewport: Viewport = {
  themeColor: "#201f31",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <LibraryProvider>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <Navbar />
              <div className="flex flex-1 container mx-auto px-4 gap-6 pt-4">
                <Sidebar />
                <PageAnimatePresence>
                  {children}
                </PageAnimatePresence>
              </div>
            </div>
          </LibraryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

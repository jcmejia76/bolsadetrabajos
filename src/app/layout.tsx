import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { AccessibilityWidget } from "@/components/accessibility/accessibility-widget";
import { SupportChatWidget } from "@/components/support/support-chat-widget";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolsa de Trabajos",
  description: "Plataforma de empleo para empresas y candidatos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const initialName = session?.user?.name ?? "";
  const initialEmail = session?.user?.email ?? "";

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AccessibilityProvider>
            <MotionProvider>
              {children}
              <Toaster />
              <AccessibilityWidget />
              <SupportChatWidget initialName={initialName} initialEmail={initialEmail} />
            </MotionProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

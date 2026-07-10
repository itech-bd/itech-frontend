import type { Metadata } from "next";
import { Instrument_Sans, Hind_Siliguri } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Toaster } from "sonner";
import { locales } from "@/lib/i18n/routing";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "iTechBD Ltd",
    template: "%s | iTechBD Ltd",
  },
  description: "iTechBD Ltd public website and student panel.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${instrumentSans.variable} ${hindSiliguri.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

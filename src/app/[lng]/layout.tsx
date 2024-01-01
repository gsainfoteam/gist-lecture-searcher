import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hêra system",
  description: "Zeus v2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-189NS9CPFD" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-189NS9CPFD');
        `}
      </Script>
      <body className={notoSansKR.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

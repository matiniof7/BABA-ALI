import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "یخبندان | لبنیات و بستنی",
  description: "منوی دیجیتال لبنیات و بستنی یخبندان - بهترین بستنی‌ها، لبنیات، آبمیوه و نوشیدنی‌ها",
  openGraph: {
    title: "یخبندان | لبنیات و بستنی",
    description: "منوی دیجیتال لبنیات و بستنی یخبندان - بهترین بستنی‌ها، لبنیات، آبمیوه و نوشیدنی‌ها",
    type: "website",
    locale: "fa_IR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0F6B4F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

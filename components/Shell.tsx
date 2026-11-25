import type { ReactNode } from "react";
import JsonLd from "./JsonLd";
import Stage from "./Stage";
import { getDict } from "@/lib/content";
import { organizationLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

/** The <html> document shared by the Arabic and English root layouts. */
export default function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDict(locale);
  const arabic = locale === "ar";
  return (
    <html lang={locale} dir={arabic ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={`/fonts/alexandria-${arabic ? "arabic" : "latin"}-wght-normal.woff2`}
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href={`/fonts/ibm-plex-sans-arabic-${arabic ? "arabic" : "latin"}-400-normal.woff2`}
        />
        <meta name="theme-color" content="#03060d" />
        {/* Apply a saved light-mode choice before first paint. Dark is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("alpha-theme")==="light"){document.documentElement.dataset.theme="light";document.querySelector(\'meta[name="theme-color"]\').setAttribute("content","#f1f6ff")}}catch(e){}',
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">
          {dict.nav.skip}
        </a>
        <div className="backdrop" aria-hidden="true" />
        <Stage />
        {children}
        <JsonLd data={organizationLd(locale)} />
      </body>
    </html>
  );
}

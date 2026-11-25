import "./globals.css";
import type { Metadata } from "next";
import { getDict } from "@/lib/content";

export const metadata: Metadata = {
  title: "404 | ALPHA Software Solutions",
  robots: { index: false, follow: false },
};

// One 404 for the whole site, in both languages.
export default function GlobalNotFound() {
  const ar = getDict("ar").notFound;
  const en = getDict("en").notFound;
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="backdrop" aria-hidden="true" />
        <main className="lost">
          <h1 className="h2">{ar.title}</h1>
          <p className="lede">{ar.text}</p>
          <a className="btn btn--solid" href="/">{ar.back}</a>
          <div lang="en" dir="ltr" style={{ marginBlockStart: "2rem" }}>
            <p className="lede">{en.title} {en.text}</p>
            <p style={{ marginBlockStart: "1rem" }}><a className="link" href="/en/">{en.back}</a></p>
          </div>
        </main>
      </body>
    </html>
  );
}

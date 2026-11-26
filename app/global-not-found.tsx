import "./globals.css";
import type { Metadata } from "next";
import { getDict } from "@/lib/content";

export const metadata: Metadata = {
  title: "404 | ALPHA Software Solutions",
  robots: { index: false, follow: false },
};

// One 404 for the whole site, in both languages.
export default function GlobalNotFound() {
  const en = getDict("en").notFound;
  const ar = getDict("ar").notFound;
  return (
    <html lang="en" dir="ltr">
      <body>
        <div className="backdrop" aria-hidden="true" />
        <main className="lost">
          <h1 className="h2">{en.title}</h1>
          <p className="lede">{en.text}</p>
          <a className="btn btn--solid" href="/">{en.back}</a>
          <div lang="ar" dir="rtl" style={{ marginBlockStart: "2rem" }}>
            <p className="lede">{ar.title} {ar.text}</p>
            <p style={{ marginBlockStart: "1rem" }}><a className="link" href="/ar/">{ar.back}</a></p>
          </div>
        </main>
      </body>
    </html>
  );
}

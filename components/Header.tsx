"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/content";
import { href, type Locale } from "@/lib/site";

export default function Header({ locale, dict, altHref }: { locale: Locale; dict: Dict; altHref: string }) {
  const [open, setOpen] = useState(false);
  // Dark is the default. The choice is remembered in localStorage and applied before paint by Shell.
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);
  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#f1f6ff" : "#03060d");
    try {
      localStorage.setItem("alpha-theme", next ? "light" : "dark");
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  };
  const home = href(locale, "/");
  const links = [
    { id: "services", label: dict.nav.services },
    { id: "work", label: dict.nav.work },
    { id: "process", label: dict.nav.process },
    { id: "about", label: dict.nav.about },
    { id: "faq", label: dict.nav.faq },
  ];
  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <header className="header">
      <div className="wrap">
        <div className="header__bar" data-open={open}>
          <a className="brand" href={home} aria-label={dict.nav.home}>
            <img src="/media/alpha-mark.webp" alt="" width={256} height={211} />
            <span>ALPHA</span>
          </a>
          <nav className="nav" id="site-nav" aria-label={dict.nav.menu}>
            {links.map((l) => (
              <a key={l.id} href={`${home}#${l.id}`} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="header__end">
            <a className="lang" href={altHref} hrefLang={other} lang={other} aria-label={dict.nav.switchAria}>
              {dict.nav.switchLabel}
            </a>
            <button
              type="button"
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={light ? dict.nav.themeDark : dict.nav.themeLight}
              title={light ? dict.nav.themeDark : dict.nav.themeLight}
            >
              <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
              <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </button>
            <a className="btn btn--solid" href={`${home}#contact`}>
              {dict.nav.cta}
            </a>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? dict.nav.close : dict.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

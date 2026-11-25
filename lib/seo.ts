import type { Metadata } from "next";
import { getDict } from "./content";
import type { Project } from "./projects";
import { absolute, href, site, type Locale } from "./site";

const ogLocale: Record<Locale, string> = { ar: "ar_EG", en: "en_US" };

/** Canonical + hreflang + Open Graph for one page that exists in both languages. */
export function pageMetadata(locale: Locale, path: string, title: string | null, description: string): Metadata {
  const dict = getDict(locale);
  const url = absolute(href(locale, path));
  const other: Locale = locale === "ar" ? "en" : "ar";
  const image = { url: `/og-${locale}.jpg`, width: 1200, height: 630, alt: dict.meta.ogAlt };
  const fullTitle = title ? dict.meta.titleTemplate.replace("%s", title) : dict.meta.title;
  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: absolute(href("ar", path)),
        en: absolute(href("en", path)),
        "x-default": absolute(href("ar", path)),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[other]],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    formatDetection: { telephone: false },
  };
}

const orgId = `${site.url}/#organization`;

export function organizationLd(locale: Locale) {
  const dict = getDict(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        alternateName: ["ALPHA", "ألفا للحلول البرمجية"],
        url: site.url,
        logo: absolute("/alpha-mark.png"),
        description: dict.meta.description,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone,
          contactType: "sales",
          availableLanguage: ["Arabic", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: ["ar", "en"],
        publisher: { "@id": orgId },
      },
    ],
  };
}

export function homeLd(locale: Locale) {
  const dict = getDict(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: dict.nav.services,
        itemListElement: dict.pack.items.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Service", name: s.name, description: s.text, provider: { "@id": orgId } },
        })),
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: dict.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function projectLd(locale: Locale, p: Project) {
  const dict = getDict(locale);
  const url = absolute(href(locale, `/work/${p.slug}`));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case`,
        url,
        name: p.title,
        headline: p.title,
        description: p.summary[locale],
        inLanguage: locale,
        image: absolute(`/media/work/${p.image}-1400.webp`),
        genre: p.category[locale],
        keywords: p.tags.join(", ") || undefined,
        creator: { "@id": orgId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dict.project.crumbHome, item: absolute(href(locale, "/")) },
          { "@type": "ListItem", position: 2, name: dict.project.crumbWork, item: absolute(href(locale, "/")) + "#work" },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  };
}

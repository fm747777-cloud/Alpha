export type Locale = "ar" | "en";
export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export const site = {
  name: "ALPHA Software Solutions",
  shortName: "ALPHA",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://alphaa-tech.com").replace(/\/$/, ""),
  phone: "+201113113117",
  phoneDisplay: "+20 111 311 3117",
  whatsapp: "201113113117",
  email: "Info@Alpha.Com",
};

/** Arabic lives at the root, English under /en. Paths always end with a slash. */
export function href(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const prefixed = locale === "en" ? `/en${clean}` : clean;
  if (prefixed.includes("#")) return prefixed;
  return prefixed.endsWith("/") ? prefixed : `${prefixed}/`;
}

export function absolute(path: string): string {
  return `${site.url}${path}`;
}

export function alternates(path = "/") {
  return {
    canonicalAr: absolute(href("ar", path)),
    canonicalEn: absolute(href("en", path)),
  };
}

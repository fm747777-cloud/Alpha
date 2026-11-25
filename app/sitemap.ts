import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { absolute, href } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...projects.map((p) => `/work/${p.slug}`)];
  const lastModified = new Date();
  return paths.flatMap((path) => {
    const languages = { ar: absolute(href("ar", path)), en: absolute(href("en", path)), "x-default": absolute(href("ar", path)) };
    return (["ar", "en"] as const).map((locale) => ({
      url: absolute(href(locale, path)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}

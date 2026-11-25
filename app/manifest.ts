import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    start_url: "/",
    display: "standalone",
    background_color: "#03060d",
    theme_color: "#03060d",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

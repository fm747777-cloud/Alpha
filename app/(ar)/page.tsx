import type { Metadata } from "next";
import Home from "@/components/Home";
import { getDict } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const dict = getDict("ar");

export const metadata: Metadata = pageMetadata("ar", "/", null, dict.meta.description);

export default function Page() {
  return <Home locale="ar" dict={dict} />;
}

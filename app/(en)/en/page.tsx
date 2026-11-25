import type { Metadata } from "next";
import Home from "@/components/Home";
import { getDict } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const dict = getDict("en");

export const metadata: Metadata = pageMetadata("en", "/", null, dict.meta.description);

export default function Page() {
  return <Home locale="en" dict={dict} />;
}

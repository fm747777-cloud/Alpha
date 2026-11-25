import "../globals.css";
import Shell from "@/components/Shell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Shell locale="ar">{children}</Shell>;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectView from "@/components/ProjectView";
import { getDict } from "@/lib/content";
import { getProject, projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

const dict = getDict("en");

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata("en", `/work/${project.slug}`, `${project.title} — ${project.category["en"]}`, project.summary["en"]);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ProjectView locale="en" dict={dict} project={project} />;
}

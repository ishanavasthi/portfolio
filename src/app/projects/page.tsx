import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";
import { BackLink } from "@/components/layout/back-link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work - LLM systems, agentic tooling, and more.",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-12 md:px-6 md:pt-20">
        <BackLink />
      </div>
      <Projects />
    </>
  );
}

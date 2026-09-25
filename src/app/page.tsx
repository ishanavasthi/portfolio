import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About activity={<GitHubActivity />} />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}

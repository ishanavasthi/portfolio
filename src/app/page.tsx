import { AgentFlow } from "@/components/motion/agent-flow";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AgentFlow />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}

import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Projects />
    </>
  );
}

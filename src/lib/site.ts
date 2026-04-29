export const site = {
  name: "Ishan Avasthi",
  shortName: "Ishan Avasthi",
  title: "AI Engineer",
  description:
    "I build LLM-powered systems, agentic workflows, and developer tools.",
  url: "https://ishanavasthi.in",
} as const;

export const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const;

export const socials = {
  github: "https://github.com/ishanavasthi",
  linkedin: "https://www.linkedin.com/in/ishanavasthi",
  email: "mailto:hello@ishanavasthi.in",
} as const;

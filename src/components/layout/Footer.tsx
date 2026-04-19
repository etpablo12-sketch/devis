import { Container } from "../ui/Container";

const links = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Support", href: "#contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="font-script text-3xl text-primary-600 dark:text-primary-400">Divas</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Verified nail artists, simple booking, and secure payments — made for a lighter day.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-zinc-600 transition duration-200 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-12 border-t border-zinc-100 pt-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          © {new Date().getFullYear()} Divas. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

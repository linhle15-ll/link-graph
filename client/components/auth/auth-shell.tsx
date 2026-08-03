import Link from "next/link";
import { GitBranch, Network, Sparkles } from "lucide-react";

import { auth } from "@/lib/theme";

const HIGHLIGHTS = [
  {
    icon: Network,
    title: "Folders per topic",
    body: "Keep every source for a question in one place.",
  },
  {
    icon: GitBranch,
    title: "Reasoned connections",
    body: "Record why two sources belong together, not just that they do.",
  },
  {
    icon: Sparkles,
    title: "Readable at a glance",
    body: "A graph you can actually follow months later.",
  },
];

/** Two-column layout shared by every auth screen. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={auth.page}>
      <aside className={auth.aside}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Network className="size-5" strokeWidth={2.2} />
          </span>
          <span className="text-foreground font-serif text-xl font-semibold tracking-tight">
            Nexus
          </span>
        </Link>

        <div className="flex flex-col gap-8">
          <h2 className={auth.asideTitle}>
            Turn a pile of tabs into a map you can reason about.
          </h2>
          <ul className="flex flex-col gap-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="bg-accent text-accent-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-foreground text-sm font-medium">{title}</p>
                  <p className={auth.asideBody}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure className="border-primary/40 border-l-2 pl-4">
          {/* <Quote className="mb-2 size-4 text-primary" /> */}
          {/* <blockquote className={auth.asideBody}>
            The point of a citation graph is the argument between the nodes.
          </blockquote> */}
          {/* <figcaption className="mt-2 text-xs text-muted-foreground">
            Research workflow notes
          </figcaption> */}
        </figure>
      </aside>

      <main className={auth.main}>{children}</main>
    </div>
  );
}

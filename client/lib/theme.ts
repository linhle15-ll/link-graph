/**
 * Single source of truth for reusable Tailwind class recipes.
 *
 * Every screen imports from here instead of hand-writing color, typography and
 * surface classes. If a visual decision needs to change, change it once here.
 */

/* -------------------------------------------------------------------------- */
/*  Folder accent colors                                                      */
/* -------------------------------------------------------------------------- */

export const FOLDER_COLORS = [
  { token: "chart-1", label: "Teal" },
  { token: "chart-2", label: "Amber" },
  { token: "chart-3", label: "Blue" },
  { token: "chart-4", label: "Rose" },
  { token: "chart-5", label: "Green" },
] as const;

export type FolderColorToken = (typeof FOLDER_COLORS)[number]["token"];

/** Resolves a folder color token to a CSS variable, falling back to the first. */
export function colorVar(token?: string | null) {
  const valid = FOLDER_COLORS.some((c) => c.token === token);
  return `var(--${valid ? token : "chart-1"})`;
}

/* -------------------------------------------------------------------------- */
/*  Typography                                                                */
/* -------------------------------------------------------------------------- */

export const typography = {
  /** Marketing / page-level heading. */
  display:
    "font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl",
  /** Heading inside a page section or a workspace column. */
  heading:
    "font-serif text-lg font-semibold leading-tight text-foreground text-balance",
  /** Heading inside a card. */
  cardTitle:
    "font-serif text-lg font-semibold leading-snug text-card-foreground text-balance",
  /** Heading inside a dialog or docked panel. */
  panelTitle: "font-serif text-base font-semibold text-card-foreground",
  dialogTitle: "font-serif text-xl",
  /** Default paragraph copy. */
  lead: "text-base leading-relaxed text-muted-foreground text-pretty",
  body: "text-sm leading-relaxed text-foreground",
  bodyMuted: "text-sm leading-relaxed text-muted-foreground",
  /** Small helper / metadata copy. */
  meta: "text-xs leading-relaxed text-muted-foreground",
  /** All-caps group label, e.g. above a list. */
  eyebrow: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
  /** Muted italic copy used for empty values. */
  placeholder: "text-sm italic text-muted-foreground/70",
} as const;

/* -------------------------------------------------------------------------- */
/*  Surfaces & containers                                                     */
/* -------------------------------------------------------------------------- */

export const surfaces = {
  /** Full-height app shell. */
  app: "flex h-svh flex-col bg-background",
  page: "min-h-svh bg-background",
  /** Sticky translucent top bar. */
  header:
    "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md",
  headerInner:
    "mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6",
  /** Centered content column. */
  container: "mx-auto w-full max-w-6xl px-4 sm:px-6",
  /** Raised card surface. */
  card: "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
  /** Recessed block used for read-only summaries inside a card. */
  inset: "rounded-md border border-border bg-muted/40 p-3",
  /** Empty-state container. */
  empty:
    "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center",
  /** Left navigation / link list column. */
  sidebar: "flex flex-col bg-sidebar",
  /** Hairline divider matching panel padding. */
  divider: "border-b border-border",
} as const;

/* -------------------------------------------------------------------------- */
/*  Interactive bits                                                          */
/* -------------------------------------------------------------------------- */

export const controls = {
  /** Small square icon-only button (close, more, etc.). */
  iconButton:
    "rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  /** Row in a selectable list. */
  listItem:
    "flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition hover:bg-muted",
  listItemActive: "bg-accent text-accent-foreground hover:bg-accent",
  /** Destructive text button. */
  destructive: "text-destructive hover:text-destructive",
  /** Swatch button used in color pickers. */
  swatch:
    "size-8 rounded-full ring-offset-2 ring-offset-background transition hover:scale-105",
  swatchActive: "ring-2 ring-ring",
} as const;

/* -------------------------------------------------------------------------- */
/*  Graph workspace                                                           */
/* -------------------------------------------------------------------------- */

export const graph = {
  /** Wrapper for sidebar + canvas + inspector. */
  body: "flex min-h-0 flex-1 flex-col lg:flex-row",
  /** Link list column. */
  sidebar:
    "flex max-h-[38svh] shrink-0 flex-col border-b border-border bg-sidebar lg:max-h-none lg:w-80 lg:border-b-0 lg:border-r",
  /** React Flow canvas region. */
  canvas: "relative min-h-0 min-w-0 flex-1",
  /**
   * Full-height inspector docked to the right of the canvas. It is a sibling of
   * the canvas (not an overlay) so opening it shrinks the graph instead of
   * covering it — long reasoning text stays fully readable.
   */
  inspector:
    "flex max-h-[60svh] min-h-0 shrink-0 flex-col border-border bg-card lg:h-full lg:max-h-none lg:w-[26rem] lg:border-l xl:w-[30rem]",
  inspectorHeader:
    "flex shrink-0 items-start justify-between gap-2 border-b border-border px-5 py-4",
  inspectorBody: "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5",
  inspectorFooter:
    "flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-5 py-3",
  /** React Flow control overrides so its chrome matches our tokens. */
  controls:
    "!border !border-border !bg-card !shadow-sm [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground hover:[&_button]:!bg-muted",
  minimap: "!bg-card",
  /** Node card on the canvas. */
  node: "group w-[190px] rounded-lg border bg-card px-3 py-2.5 shadow-sm transition",
  nodeHandle: "!size-2.5 !border-2 !border-background",
} as const;

/* -------------------------------------------------------------------------- */
/*  Auth screens                                                              */
/* -------------------------------------------------------------------------- */

export const auth = {
  /** Two-column shell: brand panel + form. */
  page: "flex min-h-svh flex-col bg-background lg:flex-row",
  /** Decorative brand column, hidden on small screens. */
  aside:
    "hidden shrink-0 flex-col justify-between border-r border-border bg-sidebar p-10 lg:flex lg:w-[26rem] xl:w-[30rem]",
  asideTitle:
    "font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance",
  asideBody: "text-sm leading-relaxed text-muted-foreground text-pretty",
  /** Column holding the form. */
  main: "flex flex-1 items-center justify-center px-4 py-12 sm:px-6",
  /** Form card. */
  card: "w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8",
  /** Narrow card for status screens (signed out, etc.). */
  statusCard:
    "w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-sm",
  title:
    "font-serif text-2xl font-semibold tracking-tight text-card-foreground text-balance",
  subtitle: "mt-2 text-sm leading-relaxed text-muted-foreground text-pretty",
  /** Vertical stack of fields. */
  form: "mt-6 flex flex-col gap-4",
  field: "grid gap-2",
  /** Row holding "remember me" + "forgot password". */
  fieldRow: "flex items-center justify-between gap-3",
  /** Small text link. */
  link: "font-medium text-primary underline-offset-4 transition hover:underline",
  /** Labelled "or" rule between form and alternatives. */
  separator:
    "my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
  footer: "mt-6 text-center text-sm text-muted-foreground",
  legal:
    "mt-6 text-center text-xs leading-relaxed text-muted-foreground text-pretty",
  /** Circular icon badge above a status message. */
  badge:
    "mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground",
} as const;

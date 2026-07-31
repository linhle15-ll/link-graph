import Link from "next/link";
import { Network } from "lucide-react";

import { UserMenu } from "@/components/user-menu";
import { surfaces } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function SiteHeader({
  children,
  wide = false,
}: {
  children?: React.ReactNode;
  /** Let the bar span the full window, used by the graph workspace. */
  wide?: boolean;
}) {
  return (
    <header className={surfaces.header}>
      <div className={cn(surfaces.headerInner, wide && "max-w-none")}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Network className="size-5" strokeWidth={2.2} />
          </span>
          <span className="text-foreground font-serif text-xl font-semibold tracking-tight">
            Nexus
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {children}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

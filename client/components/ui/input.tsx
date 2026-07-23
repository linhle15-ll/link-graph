import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-sm transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

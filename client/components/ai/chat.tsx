import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AIChatBox({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    // AI discussion — presentation only until the model is wired up.
    <div className="border-border bg-muted/40 grid gap-3 rounded-md border p-3">
      <p className="text-foreground text-sm font-medium">
        Discuss this connection
      </p>
      <p className="text-muted-foreground text-xs">
        Ask questions about both sources and the reasoning above. Responses will
        appear here once the assistant is connected.
      </p>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Does the second paper actually refute the first?"
          aria-label="Message the assistant"
        />
        <Button size="icon-sm" disabled>
          <Send className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}

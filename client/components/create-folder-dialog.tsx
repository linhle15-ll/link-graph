"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FOLDER_COLORS, colorVar, controls, typography } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function CreateFolderDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string>(FOLDER_COLORS[0].token);

  function reset() {
    setName("");
    setDescription("");
    setColor(FOLDER_COLORS[0].token);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give your folder a name.");
      return;
    }
    toast.success("Knowledge folder created.");
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        New folder
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className={typography.dialogTitle}>
              New knowledge folder
            </DialogTitle>
            <DialogDescription>
              A folder holds a set of related links and their knowledge graph.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Name</Label>
              <Input
                id="folder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Reinforcement Learning"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder-desc">Description</Label>
              <Textarea
                id="folder-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this collection of research about?"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {FOLDER_COLORS.map((c) => (
                  <button
                    key={c.token}
                    type="button"
                    onClick={() => setColor(c.token)}
                    aria-label={c.label}
                    aria-pressed={color === c.token}
                    className={cn(
                      controls.swatch,
                      color === c.token && controls.swatchActive,
                    )}
                    style={{ backgroundColor: colorVar(c.token) }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

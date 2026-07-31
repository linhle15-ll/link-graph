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
import { typography } from "@/lib/theme";

export type NewLinkValues = {
  title: string;
  url: string;
  description: string;
};

export function AddLinkDialog({
  onCreate,
}: {
  onCreate: (values: NewLinkValues) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setTitle("");
    setUrl("");
    setDescription("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error("A title and URL are required.");
      return;
    }
    onCreate({ title, url, description });
    toast.success("Link added to the graph.");
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-4" />
        Add link
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className={typography.dialogTitle}>
              Add a link
            </DialogTitle>
            <DialogDescription>
              Save a reference source as a node in this knowledge graph.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Attention Is All You Need"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-desc">Notes</Label>
              <Textarea
                id="link-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this source relevant?"
                rows={3}
              />
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
            <Button type="submit">Add link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

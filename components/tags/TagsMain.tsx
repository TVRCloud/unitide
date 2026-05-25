"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Search, Pencil, Trash2, GitMerge, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTaskTags, useRenameTag, useDeleteTag } from "@/hooks/useWorkspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TAG_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800",
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++)
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function TagsMain() {
  const router = useRouter();
  const { data: tags, isLoading } = useTaskTags();
  const { mutate: renameTag, isPending: isRenaming } = useRenameTag();
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag();

  const [search, setSearch] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [mergeSource, setMergeSource] = useState<string | null>(null);
  const [mergeTarget, setMergeTarget] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTag) editInputRef.current?.focus();
  }, [editingTag]);

  const filtered = tags?.filter((t) =>
    t.tag.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const startEdit = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setEditValue("");
  };

  const saveEdit = (from: string) => {
    const to = editValue.trim();
    if (!to || to === from) { cancelEdit(); return; }

    const existingTag = tags?.find((t) => t.tag === to && t.tag !== from);
    const isMerge = !!existingTag;

    renameTag(
      { from, to },
      {
        onSuccess: ({ modified }) => {
          toast.success(
            isMerge
              ? `Merged "${from}" into "${to}" (${modified} tasks updated)`
              : `Renamed "${from}" → "${to}" (${modified} tasks updated)`
          );
          cancelEdit();
        },
        onError: () => toast.error("Failed to rename tag"),
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteTag(deleteTarget, {
      onSuccess: ({ modified }) => {
        toast.success(`Removed "${deleteTarget}" from ${modified} tasks`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete tag"),
    });
  };

  const confirmMerge = () => {
    if (!mergeSource || !mergeTarget) return;
    renameTag(
      { from: mergeSource, to: mergeTarget },
      {
        onSuccess: ({ modified }) => {
          toast.success(
            `Merged "${mergeSource}" into "${mergeTarget}" (${modified} tasks updated)`
          );
          setMergeSource(null);
          setMergeTarget(null);
        },
        onError: () => toast.error("Failed to merge tags"),
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-semibold">Tags & Labels</h1>
        <p className="text-muted-foreground">
          Manage tags across all tasks — rename, merge, or delete them in bulk.
        </p>
      </motion.div>

      {/* Summary bar */}
      {!isLoading && (tags?.length ?? 0) > 0 && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{tags?.length}</span> unique tags
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {tags?.reduce((s, t) => s + t.count, 0)}
            </span>{" "}
            total task references
          </span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tag list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Tag className="h-10 w-10 mx-auto mb-3 opacity-40" />
            {search
              ? "No tags match your search."
              : "No tags found. Add tags to your tasks to see them here."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.tag}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border",
                  tagColor(item.tag)
                )}
              >
                <Tag className="h-4 w-4 shrink-0 opacity-60" />

                {/* Tag name / edit input */}
                {editingTag === item.tag ? (
                  <Input
                    ref={editInputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.tag);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="h-7 py-0 text-sm bg-background/60 border-current/30 flex-1"
                  />
                ) : (
                  <button
                    onClick={() => router.push(`/tasks?search=${encodeURIComponent(item.tag)}`)}
                    className="flex-1 text-sm font-medium text-left truncate hover:underline"
                    title={`View tasks tagged "${item.tag}"`}
                  >
                    {item.tag}
                  </button>
                )}

                <Badge
                  variant="secondary"
                  className="shrink-0 text-xs px-1.5 py-0 h-5 bg-background/50"
                >
                  {item.count}
                </Badge>

                {/* Actions */}
                {editingTag === item.tag ? (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => saveEdit(item.tag)}
                      disabled={isRenaming}
                      className="p-1 rounded hover:bg-background/40 transition-colors"
                      title="Save"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded hover:bg-background/40 transition-colors"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity [.group:hover_&]:opacity-100">
                    <button
                      onClick={() => startEdit(item.tag)}
                      className="p-1 rounded hover:bg-background/40 transition-colors"
                      title="Rename"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setMergeSource(item.tag);
                        setMergeTarget(null);
                      }}
                      className="p-1 rounded hover:bg-background/40 transition-colors"
                      title="Merge into another tag"
                    >
                      <GitMerge className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item.tag)}
                      className="p-1 rounded hover:bg-background/40 transition-colors"
                      title="Delete tag from all tasks"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Hint */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Click a tag name to view its tasks. Use the icons to rename, merge, or delete.
        </p>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag &ldquo;{deleteTarget}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the tag from all tasks. The tasks themselves are not
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete tag"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge dialog */}
      <Dialog
        open={!!mergeSource}
        onOpenChange={(o) => !o && setMergeSource(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Merge &ldquo;{mergeSource}&rdquo; into…
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            All tasks with &ldquo;{mergeSource}&rdquo; will get the selected tag instead.
          </p>
          <Command className="border rounded-lg">
            <CommandInput placeholder="Search tags…" />
            <CommandList className="max-h-48">
              <CommandEmpty>No other tags found.</CommandEmpty>
              <CommandGroup>
                {(tags ?? [])
                  .filter((t) => t.tag !== mergeSource)
                  .map((t) => (
                    <CommandItem
                      key={t.tag}
                      value={t.tag}
                      onSelect={() => setMergeTarget(t.tag)}
                      className={cn(
                        "cursor-pointer",
                        mergeTarget === t.tag && "bg-accent"
                      )}
                    >
                      <span className="flex-1">{t.tag}</span>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {t.count}
                      </Badge>
                      {mergeTarget === t.tag && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMergeSource(null)}>
              Cancel
            </Button>
            <Button
              disabled={!mergeTarget || isRenaming}
              onClick={confirmMerge}
            >
              {isRenaming ? "Merging…" : "Merge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

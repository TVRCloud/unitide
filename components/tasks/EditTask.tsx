/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Edit, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
import { TUpdateTaskSchema, updateTaskSchema } from "@/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { DatePicker } from "../ui/date-picker";
import { useEditTask } from "@/hooks/useTask";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { TaskBasicDetails } from "@/types/task";

type Props = {
  defaultValue: TaskBasicDetails;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const EditTask = ({ defaultValue, open: controlledOpen, onOpenChange }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const editTask = useEditTask(defaultValue.id);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const form = useForm<TUpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: defaultValue.title,
      description: defaultValue.description,
      status: defaultValue.status,
      priority: defaultValue.priority,
      type: defaultValue.type,
      dueDate: defaultValue.dueDate,
      tags: defaultValue.tags ?? [],
    },
  });

  const tags: string[] = form.watch("tags") ?? [];

  const addTag = (raw: string) => {
    const parts = raw.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
    const current = form.getValues("tags") ?? [];
    form.setValue("tags", [...new Set([...current, ...parts])]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    form.setValue("tags", (form.getValues("tags") ?? []).filter((t) => t !== tag));
  };

  const onSubmit = (data: any) => {
    editTask.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Task updated successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  const content = (
    <SheetContent className="overflow-y-auto min-w-[30%]">
      <SheetHeader>
        <SheetTitle>Edit Task</SheetTitle>
        <SheetDescription>Update task details</SheetDescription>
      </SheetHeader>

      <div className="mt-4 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(d) =>
                        field.onChange(d ? d.toISOString() : undefined)
                      }
                      placeholder="Pick due date"
                      clearable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-xs pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    if (tagInput.trim()) addTag(tagInput);
                  }
                }}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                placeholder="Type a tag, press Enter to add"
              />
            </FormItem>

            <Button type="submit" disabled={editTask.isPending}>
              {editTask.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </SheetContent>
  );

  // Controlled mode — no trigger rendered
  if (isControlled) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {content}
      </Sheet>
    );
  }

  // Uncontrolled mode — renders the Edit trigger button
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      {content}
    </Sheet>
  );
};

export default EditTask;

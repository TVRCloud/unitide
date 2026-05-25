/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { PlusIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { createTaskSchema, TCreateTaskSchema } from "@/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DatePicker } from "../ui/date-picker";
import { useCreateTask } from "@/hooks/useTask";
import { useInfiniteProjects } from "@/hooks/useProjects";
import { toast } from "sonner";

type Props = {
  projectId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const CreateTask = ({ projectId, open: controlledOpen, onOpenChange, trigger }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const addTask = useCreateTask();

  const { data: projectPages } = useInfiniteProjects("", undefined);
  const projects = projectPages?.pages.flat() ?? [];

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const form = useForm<TCreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      project: projectId ?? "",
      status: "todo",
      priority: "medium",
      type: "task",
      tags: [],
      assignedTo: [],
    },
  });

  const tags: string[] = form.watch("tags") ?? [];

  const addTag = (raw: string) => {
    const parts = raw.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
    const current = form.getValues("tags") ?? [];
    const next = [...new Set([...current, ...parts])];
    form.setValue("tags", next);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    form.setValue("tags", (form.getValues("tags") ?? []).filter((t) => t !== tag));
  };

  const onSubmit = (values: TCreateTaskSchema) => {
    addTask.mutate(values, {
      onSuccess: () => {
        form.reset();
        setTagInput("");
        setOpen(false);
        toast.success("Task created successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  const defaultTrigger = (
    <Button size="sm">
      <PlusIcon className="h-4 w-4 mr-1" />
      Add Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger !== undefined ? (trigger as any) : defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Add a new task to the workspace</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project selector — only shown when no projectId prop */}
            {!projectId && (
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((p: any) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
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
                    <Textarea placeholder="Describe the task…" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
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
                          <SelectValue />
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
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(d) =>
                          field.onChange(d ? d.toISOString() : undefined)
                        }
                        placeholder="Pick start date"
                        clearable
                      />
                    </FormControl>
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
            </div>

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
                placeholder="Type a tag, press Enter or comma to add"
              />
            </FormItem>

            <Button type="submit" className="w-full" disabled={addTask.isPending}>
              {addTask.isPending ? "Creating…" : "Create Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;

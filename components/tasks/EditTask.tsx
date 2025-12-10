/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit } from "lucide-react";
import { useState } from "react";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditTask } from "@/hooks/useTask";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { TaskBasicDetails } from "@/types/task";

type Props = {
  defaultValue: TaskBasicDetails;
};

const EditTask = ({ defaultValue }: Props) => {
  const [open, setOpen] = useState(false);
  const editTask = useEditTask(defaultValue.id);

  const form = useForm<TUpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: defaultValue.title,
      description: defaultValue.description,
      status: defaultValue.status,
      priority: defaultValue.priority,
      type: defaultValue.type,
      dueDate: defaultValue.dueDate,
      tags: defaultValue.tags,
    },
  });

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

  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all h-9 rounded-md gap-1.5 px-3 hover:cursor-pointer">
        <Edit className="w-4 h-4" />
      </SheetTrigger>

      <SheetContent className="overflow-y-auto min-w-[30%]">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details</SheetDescription>
        </SheetHeader>

        <div className="mt-1 px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Input {...field} />
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
                    <Textarea {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATUS SELECT */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To-do</SelectItem>
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

              {/* PRIORITY SELECT */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
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

              {/* TYPE SELECT */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
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
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save</Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditTask;

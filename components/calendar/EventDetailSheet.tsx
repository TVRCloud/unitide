/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO, format } from "date-fns";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, X, Calendar, Clock, Users } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "@/components/ui/multiselect";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeField } from "./TimeField";

import { IEvent } from "@/types/calender";
import { eventSchema, TEventFormData } from "@/schemas/events";
import { useUpdateEvent, useDeleteEvent } from "@/hooks/useEvents";
import { useInfiniteUsers } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

const COLOR_CLASS: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray: "bg-gray-400",
};

const COLOR_LABEL: Record<string, string> = {
  blue: "Blue",
  green: "Green",
  red: "Red",
  yellow: "Yellow",
  purple: "Purple",
  orange: "Orange",
  gray: "Gray",
};

interface Props {
  event: IEvent | null;
  onClose: () => void;
}

export default function EventDetailSheet({ event, onClose }: Props) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { data: usersData, isLoading: usersLoading } = useInfiniteUsers(userSearch);
  const users = usersData?.pages.flat() ?? [];

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      users: [],
      startDate: new Date(),
      startTime: { hour: 9, minute: 0 },
      endDate: new Date(),
      endTime: { hour: 10, minute: 0 },
    },
  });

  const { watch, setValue } = form;
  const [watchedStartDate, watchedStartTime] = watch(["startDate", "startTime"]);

  useEffect(() => {
    const endDate = form.getValues("endDate");
    if (watchedStartDate && endDate && watchedStartDate > endDate) {
      setValue("endDate", watchedStartDate);
    }
  }, [watchedStartDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!watchedStartTime) return;
    const endDate = form.getValues("endDate");
    const startDate = form.getValues("startDate");
    const sameDay =
      startDate && endDate && startDate.toDateString() === endDate.toDateString();
    if (sameDay) {
      const endTime = form.getValues("endTime");
      const startMins = watchedStartTime.hour * 60 + watchedStartTime.minute;
      const endMins = endTime.hour * 60 + endTime.minute;
      if (endMins <= startMins) {
        setValue("endTime", {
          hour: (watchedStartTime.hour + 1) % 24,
          minute: watchedStartTime.minute,
        });
      }
    }
  }, [watchedStartTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset form and edit mode when event changes
  useEffect(() => {
    setEditMode(false);
    setDeleteOpen(false);
    if (!event || event.isTask) return;
    form.reset({
      title: event.title,
      description: event.description ?? "",
      users: (event.users ?? []).map((u: any) => u._id ?? u),
      startDate: parseISO(event.startDate),
      startTime: event.startTime ?? { hour: 9, minute: 0 },
      endDate: parseISO(event.endDate),
      endTime: event.endTime ?? { hour: 10, minute: 0 },
    });
  }, [event]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!event) return null;

  const eventId = String(event.id).replace("task_", "");
  const isTask = event.isTask;

  const handleSave = (data: TEventFormData) => {
    updateEvent(
      { id: eventId, data },
      {
        onSuccess: () => {
          toast.success("Event updated");
          setEditMode(false);
          onClose();
        },
        onError: () => toast.error("Failed to update event"),
      }
    );
  };

  const handleDelete = () => {
    deleteEvent(eventId, {
      onSuccess: () => {
        toast.success("Event deleted");
        setDeleteOpen(false);
        onClose();
      },
      onError: () => toast.error("Failed to delete event"),
    });
  };

  const startDt = parseISO(event.startDate);
  const endDt = parseISO(event.endDate);

  return (
    <>
      <Sheet open={!!event} onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full shrink-0",
                    COLOR_CLASS[event.color] ?? "bg-primary"
                  )}
                />
                <SheetTitle className="truncate">{event.title}</SheetTitle>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {isTask && (
              <Badge variant="secondary" className="w-fit text-xs">
                Task
              </Badge>
            )}
          </SheetHeader>

          {/* View mode */}
          {!editMode && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">
                    {format(startDt, "EEEE, MMMM d, yyyy")}
                  </p>
                  {!isTask && (
                    <p className="text-muted-foreground text-xs mt-0.5">
                      to {format(endDt, "MMMM d, yyyy")}
                    </p>
                  )}
                </div>
              </div>

              {!isTask && event.startTime && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    {String(event.startTime.hour).padStart(2, "0")}:
                    {String(event.startTime.minute).padStart(2, "0")}
                    {" – "}
                    {event.endTime
                      ? `${String(event.endTime.hour).padStart(2, "0")}:${String(event.endTime.minute).padStart(2, "0")}`
                      : "—"}
                  </span>
                </div>
              )}

              {event.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              )}

              {!isTask && event.users && event.users.length > 0 && (
                <div className="flex items-start gap-3 text-sm">
                  <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {event.users.map((u: any) => (
                      <Badge key={u._id ?? u} variant="secondary" className="text-xs">
                        {u.name ?? u}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {!isTask && (
                <div className="flex items-center gap-2 pt-2">
                  <Badge
                    className={cn(
                      "text-xs text-white capitalize",
                      COLOR_CLASS[event.color] ?? "bg-primary"
                    )}
                  >
                    {COLOR_LABEL[event.color] ?? event.color}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {isTask ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      router.push(`/tasks/${eventId}`);
                      onClose();
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Task
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Edit mode */}
          {editMode && !isTask && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignees</FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={users.map((u: any) => ({
                            label: u.name,
                            value: u._id,
                          }))}
                          isLoading={usersLoading}
                          onSearchChange={setUserSearch}
                          placeholder="Select assignees…"
                          searchPlaceholder="Search users…"
                          emptyText="No users found"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pick start date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TimeField
                    control={form.control}
                    name="startTime"
                    label="Start Time"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pick end date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TimeField
                    control={form.control}
                    name="endTime"
                    label="End Time"
                  />
                </div>

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

                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" disabled={isUpdating}>
                    {isUpdating ? "Saving…" : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{event.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

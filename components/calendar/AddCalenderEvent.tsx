/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, TEventFormData } from "@/schemas/events";
import { useInfiniteUsers } from "@/hooks/useUser";
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
import { Button } from "../ui/button";
import MultiSelect from "../ui/multiselect";
import { DatePicker } from "../ui/date-picker";
import { TimeField } from "./TimeField";

const AddCalendarEvent = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useInfiniteUsers(searchQuery);

  const users = data?.pages.flat() ?? [];

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

  const onSubmit = (values: TEventFormData) => {
    console.log(values);
    setOpen(false);
    form.reset();
  };

  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event in your calendar
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="grid gap-4"
          >
            {/* USERS */}
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
                      isLoading={isLoading}
                      onSearchChange={setSearchQuery}
                      placeholder="Select assignees..."
                      searchPlaceholder="Search assignees..."
                      emptyText="No users found"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* START */}
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

            {/* END */}
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

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Event</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalendarEvent;

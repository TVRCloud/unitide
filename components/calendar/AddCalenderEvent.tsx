/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

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

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Calendar } from "../ui/calendar";
import MultiSelect from "../ui/multiselect";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { cn } from "@/lib/utils";

const AddCalendarEvent = () => {
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
      color: "blue",
    },
  });

  const onSubmit = (values: TEventFormData) => {
    console.log(values);
  };

  return (
    <Dialog>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* USERS */}
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
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
                      placeholder="Select members..."
                      searchPlaceholder="Search members..."
                      emptyText="No members found"
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
              <DatePickerField
                control={form.control}
                name="startDate"
                label="Start Date"
              />
              <TimeField
                control={form.control}
                name="startTime"
                label="Start Time"
              />
            </div>

            {/* END */}
            <div className="grid grid-cols-2 gap-2">
              <DatePickerField
                control={form.control}
                name="endDate"
                label="End Date"
              />
              <TimeField
                control={form.control}
                name="endTime"
                label="End Time"
              />
            </div>

            {/* COLOR */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "blue",
                        "green",
                        "red",
                        "yellow",
                        "purple",
                        "orange",
                        "gray",
                      ].map((c) => (
                        <SelectItem key={c} value={c}>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-3.5 w-3.5 rounded-full",
                                c === "blue" && "bg-blue-600",
                                c === "green" && "bg-green-600",
                                c === "red" && "bg-red-600",
                                c === "yellow" && "bg-yellow-600",
                                c === "purple" && "bg-purple-600",
                                c === "orange" && "bg-orange-600",
                                c === "gray" && "bg-neutral-600"
                              )}
                            />
                            {c}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

import { Control } from "react-hook-form";

const DatePickerField = ({
  control,
  name,
  label,
}: {
  control: Control<any>;
  name: "startDate" | "endDate";
  label: string;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

const TimeField = ({
  control,
  name,
  label,
}: {
  control: Control<any>;
  name: "startTime" | "endTime";
  label: string;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            max={23}
            value={field.value.hour}
            onChange={(e) =>
              field.onChange({
                ...field.value,
                hour: Number(e.target.value),
              })
            }
            placeholder="HH"
          />
          <Input
            type="number"
            min={0}
            max={59}
            value={field.value.minute}
            onChange={(e) =>
              field.onChange({
                ...field.value,
                minute: Number(e.target.value),
              })
            }
            placeholder="MM"
          />
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

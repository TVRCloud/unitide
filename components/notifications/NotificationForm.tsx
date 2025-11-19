"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createNotificationSchema,
  TCreateNotificationSchema,
} from "@/schemas/notification";

const mockUsers = [
  { id: "690c46954ff6e77ed5990b2f", name: "Amegh T S" },
  { id: "690c7b02d514d0141bcb5d9e", name: "Jithin P" },
  { id: "690c7b1ad514d0141bcb5da4", name: "Rahul" },
  { id: "690d6d968679fdfc7e5c3c94", name: "Arshad" },
];

const availableRoles = ["admin", "manager", "lead", "member"];

export default function NotificationForm() {
  const form = useForm<TCreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      type: "BROADCAST",
      title: "",
      body: "",
      audienceType: "ALL",
      roles: [],
      users: [],
    },
  });

  // ✔ Safe + React-Compiler friendly
  const audienceType = useWatch({
    control: form.control,
    name: "audienceType",
    defaultValue: "ALL",
  });

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (data) => {
          await fetch("/api/notifications/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        })}
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Body */}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notification Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BROADCAST">Broadcast</SelectItem>
                  <SelectItem value="ROLE_BASED">Role Based</SelectItem>
                  <SelectItem value="DIRECT">Direct</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="TASK">Task</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Audience Type */}
        <FormField
          control={form.control}
          name="audienceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audience Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="USER">Users</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ROLE MULTI SELECT */}
        {audienceType === "ROLE" && (
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Roles</FormLabel>

                <Command className="rounded-md border shadow-md">
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {availableRoles.map((role) => {
                        const isSelected = field.value?.includes(role) ?? false;

                        return (
                          <CommandItem
                            key={role}
                            onSelect={() => {
                              if (isSelected) {
                                field.onChange(
                                  (field.value ?? []).filter((r) => r !== role)
                                );
                              } else {
                                field.onChange([...(field.value ?? []), role]);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {role}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* USER MULTI SELECT */}
        {audienceType === "USER" && (
          <FormField
            control={form.control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Users</FormLabel>

                <Command className="rounded-md border shadow-md">
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {mockUsers.map((user) => {
                        const isSelected =
                          field.value?.includes(user.id) ?? false;

                        return (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              if (isSelected) {
                                field.onChange(
                                  (field.value ?? []).filter(
                                    (u) => u !== user.id
                                  )
                                );
                              } else {
                                field.onChange([
                                  ...(field.value ?? []),
                                  user.id,
                                ]);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Send Notification</Button>
      </form>
    </Form>
  );
}

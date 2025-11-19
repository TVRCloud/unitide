"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useInfiniteUsers } from "@/hooks/useUser";
import {
  createNotificationSchema,
  TCreateNotificationSchema,
} from "@/schemas/notification";
import MultiSelect from "../ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateNotification } from "@/hooks/useNotifications";
import { toast } from "sonner";

const AddNotification = () => {
  const [open, setOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const createNotification = useCreateNotification();
  const { data, isFetching } = useInfiniteUsers(userSearch);
  const allUsers = data?.pages.flat() ?? [];

  const userOptions = allUsers.map((u) => ({
    label: `${u.name} (${u.role})`,
    value: u._id,
  }));

  const form = useForm<TCreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      type: "BROADCAST",
      audienceType: "ALL",
      title: "",
      body: "",
      roles: [],
      users: [],
    },
  });

  const onSubmit = async (values: TCreateNotificationSchema) => {
    await createNotification.mutateAsync(values, {
      onSuccess: () => {
        // toast.success("Notification created successfully");
        setOpen(false);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const audienceType = form.watch("audienceType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all">
        <Plus className="h-4 w-4" />
        Create Notification
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Notification</DialogTitle>
          <DialogDescription>
            Send a notification to users, roles, or all.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter message" {...field} />
                  </FormControl>
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
                  <FormLabel>Audience</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select audience..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="ROLE">Role-based</SelectItem>
                        <SelectItem value="USER">User-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role-based */}
            {audienceType === "ROLE" && (
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Roles</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value || []}
                        onChange={(v) => field.onChange(v)}
                        options={[
                          { label: "Admin", value: "admin" },
                          { label: "Manager", value: "manager" },
                          { label: "Staff", value: "staff" },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* User-based */}
            {audienceType === "USER" && (
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Users</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value || []}
                        onChange={(v) => field.onChange(v)}
                        options={userOptions}
                        isLoading={isFetching}
                        onSearchChange={(value) => setUserSearch(value)}
                        placeholder="Select users..."
                        searchPlaceholder="Search users..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              Send Notification
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNotification;

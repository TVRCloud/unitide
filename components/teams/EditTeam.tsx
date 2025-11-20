"use client";

import { Edit2, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import AddMembers from "./AddMembers";
import { createTeamSchema, TUpdateTeamSchema } from "@/schemas/teams";
import { useEditTeam } from "@/hooks/useTeam";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  defaultValues: {
    _id: string;
    name: string;
    description: string;
    members: {
      _id: string;
      name: string;
    }[];
  };
};

const EditTeam = ({ defaultValues }: Props) => {
  const [open, setOpen] = useState(false);
  const editTeam = useEditTeam(defaultValues._id);
  const form = useForm<TUpdateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      ...defaultValues,
      members: defaultValues.members?.map((m) => m._id) ?? [],
    },
  });

  const onSubmit = async (values: TUpdateTeamSchema) => {
    await editTeam.mutateAsync(values, {
      onSuccess: () => {
        toast.success("Team updated successfully");
        setOpen(false);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all h-10 rounded-md gap-1.5 px-3">
        <Edit2 className="w-4 h-4 mr-2" />
        Edit Details
      </SheetTrigger>

      <SheetContent className="overflow-y-auto min-w-[30%]">
        <SheetHeader>
          <SheetTitle>Edit Team</SheetTitle>
          <SheetDescription>
            Update the team details and save your changes.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-1 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter team name"
                          {...field}
                          className="pl-10"
                        />
                      </div>
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
                      <Textarea
                        placeholder="Enter team description"
                        {...field}
                        className="w-full resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AddMembers form={form} />

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditTeam;

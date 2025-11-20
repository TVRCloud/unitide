"use client";

import { useCreateTeam } from "@/hooks/useTeam";
import { createTeamSchema, type TCreateTeamSchema } from "@/schemas/teams";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, Users } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
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

const AddTeam = () => {
  const addTeams = useCreateTeam();
  const [open, setOpen] = useState(false);

  const form = useForm<TCreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const onSubmit = (data: TCreateTeamSchema) => {
    addTeams.mutate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success("Team created successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all">
        <Plus className="h-4 w-4" />
        Add Team
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Team</DialogTitle>
          <DialogDescription>Add a new team to your project</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full"
              disabled={addTeams.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              {addTeams.isPending ? "Creating..." : "Create Team"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeam;

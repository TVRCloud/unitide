/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { useInfiniteUsers } from "@/hooks/useUser";
import MultiSelect from "../ui/multiselect";
import { TUpdateTaskSchema, updateTaskSchema } from "@/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditAssignees } from "@/hooks/useTask";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Props = {
  setOpen: (open: boolean) => void;
  id: string;
  assignees: { _id: string; name: string }[];
};

const AssigneeSelector = ({ assignees, setOpen, id }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const editAssignees = useEditAssignees(id);

  const { data, isLoading } = useInfiniteUsers(searchQuery);
  const filteredUsers = data?.pages.flat() || [];

  const form = useForm<TUpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      assignedTo: assignees.map((a) => a._id),
    },
  });

  const onSubmit = (data: any) => {
    editAssignees.mutate(data, {
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
    console.log(error);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Members</FormLabel>
                <FormControl>
                  <MultiSelect
                    value={field.value as string[]}
                    onChange={field.onChange}
                    options={filteredUsers.map((user: any) => ({
                      label: user.name,
                      value: user._id,
                    }))}
                    isLoading={isLoading}
                    onSearchChange={setSearchQuery}
                    placeholder="Select members..."
                    searchPlaceholder="Search members..."
                    emptyText="No members found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2">
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AssigneeSelector;

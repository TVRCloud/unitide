/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import MultiSelect from "../ui/multiselect";
import { useInfiniteUsers } from "@/hooks/useUser";
import { UseFormReturn } from "react-hook-form";
import { TCreateTeamSchema } from "@/schemas/teams";

interface Props {
  form: UseFormReturn<TCreateTeamSchema>;
}

const AddMembers = ({ form }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useInfiniteUsers(searchQuery);
  const filteredUsers = data?.pages.flat() || [];

  return (
    <>
      <FormField
        control={form.control}
        name="members"
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
    </>
  );
};

export default AddMembers;

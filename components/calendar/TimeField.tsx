"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TimeValue {
  hour: number;
  minute: number;
}

interface TimeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function TimeField<T extends FieldValues>({
  control,
  name,
  label,
}: TimeFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as TimeValue | undefined;

        const timeString =
          value != null
            ? `${String(value.hour).padStart(2, "0")}:${String(
                value.minute
              ).padStart(2, "0")}`
            : "";

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Input
              type="time"
              value={timeString}
              onChange={(e) => {
                const [hour, minute] = e.target.value.split(":").map(Number);
                field.onChange({ hour, minute });
              }}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWorkspace, useUpdateWorkspace } from "@/hooks/useWorkspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Building2, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  timezone: z.string().min(1),
  defaultPriority: z.enum(["low", "medium", "high", "urgent"]),
  workingHoursFrom: z.number().int().min(0).max(23),
  workingHoursTo: z.number().int().min(1).max(24),
  maxFileSizeMB: z.number().int().min(1).max(100),
});

type FormData = z.infer<typeof schema>;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo",
  "Australia/Sydney",
];

export default function WorkspaceMain() {
  const { data: ws, isLoading } = useWorkspace();
  const { mutate: save, isPending } = useUpdateWorkspace();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      orgName: "",
      timezone: "UTC",
      defaultPriority: "medium",
      workingHoursFrom: 8,
      workingHoursTo: 17,
      maxFileSizeMB: 10,
    },
  });

  // Pre-fill once data loads
  useEffect(() => {
    if (!ws) return;
    form.reset({
      orgName: ws.orgName ?? "",
      timezone: ws.timezone ?? "UTC",
      defaultPriority: ws.defaultPriority ?? "medium",
      workingHoursFrom: ws.workingHours?.from ?? 8,
      workingHoursTo: ws.workingHours?.to ?? 17,
      maxFileSizeMB: ws.maxFileSizeMB ?? 10,
    });
    setWorkingDays(ws.workingDays ?? [1, 2, 3, 4, 5]);
  }, [ws, form]);

  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleDay = (day: number) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const onSubmit = (data: FormData) => {
    save(
      {
        orgName: data.orgName,
        timezone: data.timezone,
        defaultPriority: data.defaultPriority,
        workingDays,
        workingHours: { from: data.workingHoursFrom, to: data.workingHoursTo },
        maxFileSizeMB: data.maxFileSizeMB,
      },
      {
        onSuccess: () => toast.success("Workspace settings saved"),
        onError: () => toast.error("Failed to save settings"),
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-semibold">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Organization-level configuration that applies to all users.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="orgName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultPriority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Task Priority</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["low", "medium", "high", "urgent"].map((p) => (
                            <SelectItem key={p} value={p} className="capitalize">
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Working hours */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Working Days</p>
                  <div className="flex gap-2">
                    {DAY_LABELS.map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={cn(
                          "w-10 h-10 rounded-full text-xs font-medium border transition-colors",
                          workingDays.includes(idx)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-muted"
                        )}
                      >
                        {label[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workingHoursFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Hour</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={23}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workingHoursTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Hour</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={24}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Limits */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="maxFileSizeMB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max File Upload Size (MB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Saving…" : "Save Settings"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}


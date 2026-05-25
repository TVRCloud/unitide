"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTimelogs } from "@/hooks/useWorkspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Clock } from "lucide-react";
import { DateTime } from "luxon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignedAvatar } from "@/components/ui/signed-avatar";

type TimelogRow = {
  taskId: string;
  taskTitle: string;
  user: { _id: string; name: string; avatar?: string };
  minutes: number;
  note?: string;
  date: string;
};

function minutesToHours(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
}

export default function TimesheetMain() {
  const defaultFrom = DateTime.now().startOf("month").toISODate() ?? "";
  const defaultTo = DateTime.now().toISODate() ?? "";

  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);

  const { data: rows, isLoading } = useTimelogs(dateFrom, dateTo);
  const logs: TimelogRow[] = rows ?? [];

  const totalMins = logs.reduce((s, r) => s + (r.minutes ?? 0), 0);

  const exportCSV = () => {
    const header = "Date,User,Task,Hours,Note";
    const body = logs.map((r) =>
      [
        r.date,
        r.user?.name ?? "Unknown",
        `"${r.taskTitle}"`,
        minutesToHours(r.minutes),
        `"${r.note ?? ""}"`,
      ].join(",")
    );
    const csv = [header, ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timesheet-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-semibold">Timesheet</h1>
        <p className="text-muted-foreground">
          Time logged against tasks across the team.
        </p>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium shrink-0">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium shrink-0">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={logs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <div className="ml-auto flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Total: {minutesToHours(totalMins)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Time Entries
            {!isLoading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({logs.length} entries)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
              No time entries in this date range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-left">
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Task</th>
                    <th className="pb-3 pr-4 font-medium">Time</th>
                    <th className="pb-3 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {DateTime.fromISO(row.date).toLocaleString(
                          DateTime.DATE_MED
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <SignedAvatar
                            src={row.user?.avatar}
                            name={row.user?.name ?? "?"}
                            avatarClassName="h-7 w-7 text-xs"
                          />
                          <span className="whitespace-nowrap">
                            {row.user?.name ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 max-w-[200px] truncate">
                        {row.taskTitle}
                      </td>
                      <td className="py-3 pr-4 font-medium whitespace-nowrap">
                        {minutesToHours(row.minutes)}
                      </td>
                      <td className="py-3 text-muted-foreground max-w-[200px] truncate">
                        {row.note || "—"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td
                      colSpan={3}
                      className="pt-3 pr-4 font-semibold text-right"
                    >
                      Total
                    </td>
                    <td className="pt-3 font-bold">
                      {minutesToHours(totalMins)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

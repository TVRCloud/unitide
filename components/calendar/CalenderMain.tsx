"use client";
import { motion } from "framer-motion";
import CalendarHeader from "./CalendarHeader";
import { useMemo, useState } from "react";
import { IEvent, TCalendarView } from "@/types/calender";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarStore } from "@/store/useCalender";
import {
  calculateMonthEventPositions,
  getCalendarCells,
  getEventBlockStyle,
  getMonthCellEvents,
  getVisibleHours,
  groupEvents,
  isWorkingHour,
} from "@/utils/calender";
import { cn } from "@/lib/utils";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { Badge } from "../ui/badge";
import { useInfiniteTasks } from "@/hooks/useTask";
import EventDetailSheet from "./EventDetailSheet";

// ─── Colour maps ─────────────────────────────────────────────────────────────

const COLOR_CLASS: Record<string, string> = {
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
  yellow: "bg-yellow-400 text-black",
  purple: "bg-purple-500 text-white",
  orange: "bg-orange-500 text-white",
  gray: "bg-gray-400 text-white",
};

const COLOR_DOT: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray: "bg-gray-400",
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "red",
  high: "orange",
  medium: "yellow",
  low: "blue",
};

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}

function safeISO(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!isValidDate(d)) return null;
  return startOfDay(d).toISOString();
}

// ─── Month View ───────────────────────────────────────────────────────────────

const SLOT_H = 22;
const DAY_NUM_H = 26;
const MAX_SLOTS = 3;

function MonthView({
  items,
  selectedDate,
  onDayClick,
  onEventClick,
}: {
  items: IEvent[];
  selectedDate: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (event: IEvent) => void;
}) {
  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  // Chunk cells into week rows
  const weeks = useMemo(() => {
    const w: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    return w;
  }, [cells]);

  const multiDay = useMemo(
    () =>
      items.filter(
        (e) =>
          !isSameDay(parseISO(e.startDate), parseISO(e.endDate))
      ),
    [items]
  );
  const singleDay = useMemo(
    () =>
      items.filter((e) =>
        isSameDay(parseISO(e.startDate), parseISO(e.endDate))
      ),
    [items]
  );
  const positions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDay as IEvent[],
        singleDay as IEvent[],
        selectedDate
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, selectedDate]
  );

  const today = new Date();

  return (
    <div className="border rounded-lg overflow-hidden select-none">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, wi) => {
        const weekStart = startOfDay(week[0].date);
        const weekEnd = startOfDay(week[6].date);

        // Multi-day events touching this week
        const weekMultiDay = multiDay.filter((e) => {
          const s = startOfDay(parseISO(e.startDate));
          const end = startOfDay(parseISO(e.endDate));
          return s <= weekEnd && end >= weekStart;
        });

        return (
          <div
            key={wi}
            className="relative border-b last:border-b-0"
            style={{
              minHeight: `${DAY_NUM_H + MAX_SLOTS * SLOT_H + 20}px`,
            }}
          >
            {/* Clickable background cells */}
            <div className="absolute inset-0 grid grid-cols-7 z-0">
              {week.map((cell, ci) => (
                <div
                  key={ci}
                  onClick={() => onDayClick(cell.date)}
                  className={cn(
                    "border-r last:border-r-0 h-full cursor-pointer hover:bg-muted/20 transition-colors",
                    !cell.currentMonth && "bg-muted/10"
                  )}
                />
              ))}
            </div>

            {/* Day numbers */}
            <div className="relative grid grid-cols-7 z-10 pointer-events-none">
              {week.map((cell, ci) => {
                const isToday = isSameDay(cell.date, today);
                return (
                  <div
                    key={ci}
                    className="px-1 pt-1"
                    style={{ height: `${DAY_NUM_H}px` }}
                  >
                    <div
                      className={cn(
                        "text-xs w-6 h-6 flex items-center justify-center rounded-full",
                        isToday
                          ? "bg-primary text-primary-foreground font-bold"
                          : !cell.currentMonth
                          ? "text-muted-foreground"
                          : "text-foreground"
                      )}
                    >
                      {cell.day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Event bars layer */}
            <div
              className="absolute z-20 w-full"
              style={{
                top: `${DAY_NUM_H}px`,
                height: `${MAX_SLOTS * SLOT_H}px`,
              }}
            >
              {/* Multi-day spanning bars */}
              {weekMultiDay.map((event) => {
                const pos =
                  positions[event.id as string | number];
                if (pos === undefined || pos >= MAX_SLOTS) return null;

                const eventStart = startOfDay(parseISO(event.startDate));
                const eventEnd = startOfDay(parseISO(event.endDate));

                const colStart = Math.max(
                  0,
                  differenceInDays(eventStart, weekStart)
                );
                const colEnd = Math.min(
                  6,
                  differenceInDays(eventEnd, weekStart)
                );
                const span = colEnd - colStart + 1;
                const isFirst = eventStart >= weekStart;
                const isLast = eventEnd <= weekEnd;

                return (
                  <div
                    key={`multi-${event.id}-${wi}`}
                    title={event.title}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className={cn(
                      "absolute h-5 text-xs flex items-center overflow-hidden cursor-pointer z-10 hover:brightness-110 transition-[filter]",
                      COLOR_CLASS[event.color] ??
                        "bg-primary text-primary-foreground",
                      isFirst ? "rounded-l-sm pl-1" : "rounded-l-none pl-0",
                      isLast ? "rounded-r-sm pr-1" : "rounded-r-none pr-0",
                      event.isTask && "opacity-90"
                    )}
                    style={{
                      top: `${pos * SLOT_H}px`,
                      left: `calc(${(colStart / 7) * 100}% + 2px)`,
                      width: `calc(${(span / 7) * 100}% - 4px)`,
                    }}
                  >
                    {isFirst && (
                      <span className="truncate leading-none">
                        {event.isTask ? "○ " : ""}
                        {event.title}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Single-day chips */}
              {week.map((cell, ci) => {
                const dayItems = getMonthCellEvents(
                  cell.date,
                  items as IEvent[],
                  positions
                );
                const visible = dayItems.filter(
                  (e) =>
                    !e.isMultiDay &&
                    e.position >= 0 &&
                    e.position < MAX_SLOTS
                );
                return visible.map((event) => (
                  <div
                    key={`single-${event.id}-${ci}`}
                    title={event.title}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className={cn(
                      "absolute h-5 text-xs flex items-center px-1 rounded overflow-hidden cursor-pointer hover:brightness-110 transition-[filter]",
                      COLOR_CLASS[event.color] ??
                        "bg-primary text-primary-foreground",
                      event.isTask && "opacity-90"
                    )}
                    style={{
                      top: `${event.position * SLOT_H}px`,
                      left: `calc(${(ci / 7) * 100}% + 2px)`,
                      width: `calc(${(1 / 7) * 100}% - 4px)`,
                    }}
                  >
                    <span className="truncate leading-none">
                      {event.isTask ? "○ " : ""}
                      {event.title}
                    </span>
                  </div>
                ));
              })}
            </div>

            {/* Overflow counts */}
            <div
              className="absolute z-10 w-full grid grid-cols-7"
              style={{ top: `${DAY_NUM_H + MAX_SLOTS * SLOT_H}px` }}
            >
              {week.map((cell, ci) => {
                const dayItems = getMonthCellEvents(
                  cell.date,
                  items as IEvent[],
                  positions
                );
                const overflow = dayItems.filter(
                  (e) => e.position < 0 || e.position >= MAX_SLOTS
                );
                return (
                  <div key={ci} className="px-1">
                    {overflow.length > 0 && (
                      <span
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => onDayClick(cell.date)}
                      >
                        +{overflow.length} more
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  items,
  selectedDate,
  visibleHours,
  workingHours,
  onEventClick,
}: {
  items: IEvent[];
  selectedDate: Date;
  visibleHours: { from: number; to: number };
  workingHours: Record<number, { from: number; to: number }>;
  onEventClick: (event: IEvent) => void;
}) {
  const weekStart = startOfDay(startOfWeek(selectedDate));
  const weekEnd = startOfDay(endOfWeek(selectedDate));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  // All events overlapping this week
  const weekItems = items.filter((e) => {
    const s = startOfDay(parseISO(e.startDate));
    const end = startOfDay(parseISO(e.endDate));
    return s <= weekEnd && end >= weekStart;
  });

  // Multi-day events → all-day strip
  const allDayItems = weekItems.filter(
    (e) => !isSameDay(parseISO(e.startDate), parseISO(e.endDate))
  );

  // Single-day timed events → time grid
  const timedItems = weekItems.filter((e) =>
    isSameDay(parseISO(e.startDate), parseISO(e.endDate))
  );

  const { hours } = getVisibleHours(visibleHours, timedItems as IEvent[]);

  const MAX_ALLDAY_ROWS = 3;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Day header */}
      <div className="grid grid-cols-8 border-b bg-muted/30 sticky top-0 z-10">
        <div className="border-r" />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              className={cn(
                "py-2 text-center border-r last:border-r-0",
                isToday && "bg-primary/10"
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                  isToday && "bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day spanning events strip */}
      {allDayItems.length > 0 && (
        <div className="grid grid-cols-8 border-b bg-muted/10">
          <div className="border-r px-1 flex items-center justify-end pr-2">
            <span className="text-xs text-muted-foreground">All day</span>
          </div>
          <div
            className="col-span-7 relative"
            style={{
              minHeight: `${Math.min(allDayItems.length, MAX_ALLDAY_ROWS) * 24 + 4}px`,
            }}
          >
            {allDayItems.slice(0, MAX_ALLDAY_ROWS).map((event, rowIdx) => {
              const evStart = startOfDay(parseISO(event.startDate));
              const evEnd = startOfDay(parseISO(event.endDate));
              const colStart = Math.max(0, differenceInDays(evStart, weekStart));
              const colEnd = Math.min(6, differenceInDays(evEnd, weekStart));
              const span = colEnd - colStart + 1;
              const isFirst = evStart >= weekStart;
              const isLast = evEnd <= weekEnd;
              return (
                <div
                  key={event.id}
                  title={event.title}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "absolute h-5 text-xs flex items-center overflow-hidden cursor-pointer hover:brightness-110 transition-[filter]",
                    COLOR_CLASS[event.color] ?? "bg-primary text-primary-foreground",
                    isFirst ? "rounded-l-sm pl-1" : "rounded-l-none",
                    isLast ? "rounded-r-sm" : "rounded-r-none",
                    event.isTask && "opacity-90"
                  )}
                  style={{
                    top: `${rowIdx * 24 + 2}px`,
                    left: `calc(${(colStart / 7) * 100}% + 2px)`,
                    width: `calc(${(span / 7) * 100}% - 4px)`,
                  }}
                >
                  {isFirst && (
                    <span className="truncate leading-none px-0.5">
                      {event.isTask ? "○ " : ""}
                      {event.title}
                    </span>
                  )}
                </div>
              );
            })}
            {allDayItems.length > MAX_ALLDAY_ROWS && (
              <span
                className="absolute text-xs text-muted-foreground"
                style={{ top: `${MAX_ALLDAY_ROWS * 24 + 2}px`, left: "4px" }}
              >
                +{allDayItems.length - MAX_ALLDAY_ROWS} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="overflow-auto max-h-[540px]">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b"
            style={{ minHeight: "56px" }}
          >
            <div className="border-r px-2 text-xs text-muted-foreground pt-1 shrink-0">
              {format(new Date(0, 0, 0, hour), "h a")}
            </div>
            {weekDays.map((day, i) => {
              const isWorking = isWorkingHour(day, hour, workingHours);
              const hourItems = timedItems.filter(
                (e) =>
                  isSameDay(parseISO(e.startDate), day) &&
                  parseISO(e.startDate).getHours() === hour
              );
              return (
                <div
                  key={i}
                  className={cn(
                    "border-r last:border-r-0 p-0.5 space-y-0.5",
                    !isWorking && "bg-muted/20"
                  )}
                >
                  {hourItems.slice(0, 3).map((event, ei) => (
                    <div
                      key={ei}
                      title={event.title}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        "text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:brightness-110 transition-[filter]",
                        COLOR_CLASS[event.color] ??
                          "bg-primary text-primary-foreground",
                        event.isTask && "opacity-90"
                      )}
                    >
                      {event.isTask ? "○ " : ""}
                      {event.title}
                    </div>
                  ))}
                  {hourItems.length > 3 && (
                    <span
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground px-0.5"
                      onClick={() => onEventClick(hourItems[3])}
                    >
                      +{hourItems.length - 3} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {weekItems.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No events this week
        </div>
      )}
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({
  items,
  selectedDate,
  visibleHours,
  workingHours,
  onEventClick,
}: {
  items: IEvent[];
  selectedDate: Date;
  visibleHours: { from: number; to: number };
  workingHours: Record<number, { from: number; to: number }>;
  onEventClick: (event: IEvent) => void;
}) {
  const dayMidnight = startOfDay(selectedDate);

  // All events covering this day (multi-day spanning events included)
  const coveringItems = items.filter((e) => {
    const s = startOfDay(parseISO(e.startDate));
    const end = startOfDay(parseISO(e.endDate));
    return s <= dayMidnight && end >= dayMidnight;
  });

  // Multi-day events → all-day section
  const allDayItems = coveringItems.filter(
    (e) => !isSameDay(parseISO(e.startDate), parseISO(e.endDate))
  );

  // Single-day timed events → time grid
  const timedItems = coveringItems.filter((e) =>
    isSameDay(parseISO(e.startDate), parseISO(e.endDate))
  );

  const { hours } = getVisibleHours(visibleHours, timedItems as IEvent[]);
  const groups = groupEvents(timedItems as IEvent[]);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b py-3 px-4 text-center bg-muted/30">
        <p className="font-semibold">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </p>
        <p className="text-sm text-muted-foreground">
          {coveringItems.length} event{coveringItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* All-day events section */}
      {allDayItems.length > 0 && (
        <div className="border-b bg-muted/10 px-4 py-2 space-y-1">
          <p className="text-xs text-muted-foreground mb-1">All day</p>
          {allDayItems.map((event) => (
            <div
              key={event.id}
              title={event.title}
              onClick={() => onEventClick(event)}
              className={cn(
                "text-xs px-2 py-1 rounded cursor-pointer truncate hover:brightness-110 transition-[filter]",
                COLOR_CLASS[event.color] ?? "bg-primary text-primary-foreground",
                event.isTask && "opacity-90"
              )}
            >
              {event.isTask ? "○ " : ""}
              {event.title}
            </div>
          ))}
        </div>
      )}

      {/* Time grid */}
      <div className="overflow-auto max-h-[540px] relative">
        <div style={{ position: "relative" }}>
          {hours.map((hour) => {
            const isWorking = isWorkingHour(selectedDate, hour, workingHours);
            return (
              <div
                key={hour}
                className={cn("flex border-b", !isWorking && "bg-muted/20")}
                style={{ height: "60px" }}
              >
                <div className="w-16 shrink-0 border-r px-2 text-xs text-muted-foreground pt-1">
                  {format(new Date(0, 0, 0, hour), "h a")}
                </div>
                <div className="flex-1" />
              </div>
            );
          })}

          {hours.length > 0 &&
            groups.map((group, gi) =>
              group.map((event, ei) => {
                const style = getEventBlockStyle(
                  event,
                  new Date(selectedDate),
                  ei,
                  group.length,
                  visibleHours
                );
                return (
                  <div
                    key={`${event.id}-${gi}-${ei}`}
                    title={event.title}
                    onClick={() => onEventClick(event)}
                    className={cn(
                      "absolute rounded px-2 py-1 text-xs overflow-hidden cursor-pointer hover:brightness-110 transition-[filter]",
                      COLOR_CLASS[event.color] ??
                        "bg-primary text-primary-foreground",
                      event.isTask && "opacity-90"
                    )}
                    style={{
                      top: style.top,
                      left: `calc(4rem + ${style.left})`,
                      width: `calc((100% - 4rem) * ${
                        parseFloat(style.width) / 100
                      })`,
                      minHeight: "20px",
                    }}
                  >
                    <p className="font-medium truncate">
                      {event.isTask ? "○ " : ""}
                      {event.title}
                    </p>
                    <p className="opacity-80 truncate">
                      {format(parseISO(event.startDate), "h:mm a")} –{" "}
                      {format(parseISO(event.endDate), "h:mm a")}
                    </p>
                  </div>
                );
              })
            )}
        </div>
      </div>

      {coveringItems.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No events today
        </div>
      )}
    </div>
  );
}

// ─── Agenda View ──────────────────────────────────────────────────────────────

function AgendaView({
  items,
  onEventClick,
}: {
  items: IEvent[];
  onEventClick: (event: IEvent) => void;
}) {
  const sorted = [...items].sort(
    (a, b) =>
      parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground text-sm">
        No events this month
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y overflow-hidden">
      {sorted.map((event, i) => (
        <div
          key={i}
          onClick={() => onEventClick(event)}
          className="flex gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <div
            className={cn(
              "w-1 rounded-full shrink-0 self-stretch",
              COLOR_DOT[event.color] ?? "bg-primary"
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">
                {event.isTask ? "○ " : ""}
                {event.title}
              </p>
              <span className="text-xs text-muted-foreground shrink-0">
                {format(parseISO(event.startDate), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(parseISO(event.startDate), "h:mm a")} –{" "}
              {format(parseISO(event.endDate), "h:mm a")}
            </p>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Year View ────────────────────────────────────────────────────────────────

function YearView({
  items,
  selectedDate,
  onMonthClick,
}: {
  items: IEvent[];
  selectedDate: Date;
  onMonthClick: (date: Date) => void;
}) {
  const yearStart = startOfYear(selectedDate);
  const months = Array.from({ length: 12 }, (_, i) =>
    addMonths(yearStart, i)
  );
  const today = new Date();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((month, mi) => {
        const cells = getCalendarCells(month);
        const monthItems = items.filter((e) =>
          isSameMonth(parseISO(e.startDate), month)
        );

        return (
          <div
            key={mi}
            onClick={() => onMonthClick(month)}
            className="border rounded-lg p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <p className="text-sm font-semibold mb-2">
              {format(month, "MMMM")}
            </p>

            <div className="grid grid-cols-7 gap-px">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div
                  key={i}
                  className="text-center text-xs text-muted-foreground"
                >
                  {d}
                </div>
              ))}
              {cells.map((cell, ci) => {
                const isToday = isSameDay(cell.date, today);
                const hasItem = monthItems.some((e) =>
                  isSameDay(parseISO(e.startDate), cell.date)
                );
                return (
                  <div
                    key={ci}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      className={cn(
                        "text-xs w-5 h-5 flex items-center justify-center rounded-full",
                        !cell.currentMonth && "opacity-30",
                        isToday &&
                          "bg-primary text-primary-foreground font-bold"
                      )}
                    >
                      {cell.day}
                    </div>
                    {hasItem && !isToday && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>

            {monthItems.length > 0 && (
              <Badge
                variant="secondary"
                className="mt-2 text-xs w-full justify-center"
              >
                {monthItems.length} item{monthItems.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CalenderMain = () => {
  const [view, setView] = useState<TCalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const { events, selectedDate, setSelectedDate, visibleHours, workingHours } =
    useCalendarStore();
  const { isLoading: eventsLoading } = useCalendarEvents();

  // Fetch tasks and map to calendar items
  const { data: taskPages } = useInfiniteTasks("", 100);
  const tasks = taskPages?.pages.flat() ?? [];

  const taskItems: IEvent[] = useMemo(
    () =>
      tasks
        .filter((t) => {
          const due = safeISO(t.dueDate);
          return !!due;
        })
        .map((t) => {
          const endDate = safeISO(t.dueDate)!;
          const startDate = safeISO(t.startDate) ?? endDate;
          return {
            id: `task_${t._id}`,
            title: t.title,
            description: t.description ?? "",
            startDate,
            endDate,
            color:
              t.status === "completed"
                ? "green"
                : t.status === "cancelled"
                ? "gray"
                : (PRIORITY_COLOR[t.priority] as IEvent["color"]) ?? "blue",
            user: [],
            isTask: true,
          };
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskPages]
  );

  const allItems: IEvent[] = useMemo(
    () =>
      [...events, ...taskItems].filter((e) => {
        try {
          const s = parseISO(e.startDate);
          const end = parseISO(e.endDate);
          return isValidDate(s) && isValidDate(end);
        } catch {
          return false;
        }
      }),
    [events, taskItems]
  );

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setView("day");
  };

  const handleMonthClick = (date: Date) => {
    setSelectedDate(date);
    setView("month");
  };

  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col gap-4">
      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      <CalendarHeader view={view} setView={setView} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {eventsLoading ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : (
          <>
            {view === "month" && (
              <MonthView
                items={allItems}
                selectedDate={selectedDate}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
              />
            )}
            {view === "week" && (
              <WeekView
                items={allItems}
                selectedDate={selectedDate}
                visibleHours={visibleHours}
                workingHours={workingHours}
                onEventClick={handleEventClick}
              />
            )}
            {view === "day" && (
              <DayView
                items={allItems}
                selectedDate={selectedDate}
                visibleHours={visibleHours}
                workingHours={workingHours}
                onEventClick={handleEventClick}
              />
            )}
            {view === "agenda" && (
              <AgendaView items={allItems} onEventClick={handleEventClick} />
            )}
            {view === "year" && (
              <YearView
                items={allItems}
                selectedDate={selectedDate}
                onMonthClick={handleMonthClick}
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CalenderMain;

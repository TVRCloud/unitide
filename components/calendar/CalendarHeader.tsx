"use client";

import { motion } from "framer-motion";
import TodayButton from "./TodayButton";
import DateNavigator from "./DateNavigator";
import { TCalendarView } from "@/types/calender";
import { Button } from "../ui/button";
import {
  CalendarRange,
  Columns,
  Grid2x2,
  Grid3x3,
  List,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import AddCalenderEvent from "./AddCalenderEvent";

interface Props {
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
}

const CalendarHeader = ({ view, setView }: Props) => {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-3">
          <TodayButton />
          {/* <DateNavigator view={view} events={events} /> */}
        </div>

        <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
          <div className="flex w-full items-center gap-1.5">
            <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Day view"
                    size="icon"
                    variant={view === "day" ? "default" : "outline"}
                    className="rounded-r-none [&_svg]:size-5"
                    onClick={() => setView("day")}
                  >
                    <List strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Day view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Week view"
                    size="icon"
                    variant={view === "week" ? "default" : "outline"}
                    className="-ml-px rounded-none [&_svg]:size-5"
                    onClick={() => setView("week")}
                  >
                    <Columns strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Week view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Month view"
                    size="icon"
                    variant={view === "month" ? "default" : "outline"}
                    className="-ml-px rounded-none [&_svg]:size-5"
                    onClick={() => setView("month")}
                  >
                    <Grid2x2 strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Month view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Year view"
                    size="icon"
                    variant={view === "year" ? "default" : "outline"}
                    className="-ml-px rounded-none [&_svg]:size-5"
                    onClick={() => setView("year")}
                  >
                    <Grid3x3 strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Year view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Agenda view"
                    size="icon"
                    variant={view === "agenda" ? "default" : "outline"}
                    className="-ml-px rounded-l-none [&_svg]:size-5"
                    onClick={() => setView("agenda")}
                  >
                    <CalendarRange strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Agenda view</TooltipContent>
              </Tooltip>
            </div>

            {/* <UserSelect /> */}
          </div>

          <AddCalenderEvent />
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default CalendarHeader;

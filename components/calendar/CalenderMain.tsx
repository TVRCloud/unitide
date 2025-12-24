"use client";
import { motion } from "framer-motion";
import CalendarHeader from "./CalendarHeader";
import { useState } from "react";
import { TCalendarView } from "@/types/calender";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

const CalenderMain = () => {
  const [view, setView] = useState<TCalendarView>("month");

  const { isLoading } = useCalendarEvents();

  return (
    <div className="flex flex-col gap-3">
      <CalendarHeader view={view} setView={setView} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      ></motion.div>
    </div>
  );
};

export default CalenderMain;

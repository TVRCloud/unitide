"use client";
import { HeaderSection } from "../ui/header-section";
import { motion } from "framer-motion";

const CalenderMain = () => {
  return (
    <div className="flex flex-col gap-3">
      <HeaderSection title="Calendar" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      ></motion.div>
    </div>
  );
};

export default CalenderMain;

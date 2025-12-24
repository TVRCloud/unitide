import { useCalendarStore } from "@/store/useCalender";
import { DateTime } from "luxon";

const TodayButton = () => {
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);

  const today = DateTime.now();
  const handleClick = () => setSelectedDate(today.toJSDate());
  return (
    <button
      className="flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onClick={handleClick}
    >
      <p className="flex h-6 w-full items-center justify-center bg-primary text-center text-xs font-semibold text-primary-foreground">
        {today.toFormat("MMM").toUpperCase()}
      </p>
      <p className="flex w-full items-center justify-center text-lg font-bold">
        {today.day}
      </p>
    </button>
  );
};

export default TodayButton;

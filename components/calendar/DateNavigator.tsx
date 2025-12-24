import { useCalendarStore } from "@/store/useCalender";
import { TCalendarView } from "@/types/calender";
import { getEventsCount, navigateDate, rangeText } from "@/utils/calender";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  view: TCalendarView;
}
const DateNavigator = ({ view }: Props) => {
  const { selectedDate, setSelectedDate, events } = useCalendarStore();

  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view]
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
        <Badge variant="outline" className="px-1.5">
          {eventCount} events
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-sm text-muted-foreground">
          {rangeText(view, selectedDate)}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default DateNavigator;

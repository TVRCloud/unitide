import { IEvent, TCalendarView } from "@/types/calender";

interface Props {
  view: TCalendarView;
  events: IEvent[];
}
const DateNavigator = ({ view, events }: Props) => {
  return <div>DateNavigator</div>;
};

export default DateNavigator;

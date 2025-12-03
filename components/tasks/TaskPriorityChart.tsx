import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type Props = {
  data: {
    _id: string;
    count: number;
  }[];
};

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
};

const TaskPriorityChart = ({ data }: Props) => {
  const chartData = [
    {
      priority: "high",
      tasks: data.find((d) => d._id === "high")?.count ?? 0,
    },
    {
      priority: "medium",
      tasks: data.find((d) => d._id === "medium")?.count ?? 0,
    },
    {
      priority: "low",
      tasks: data.find((d) => d._id === "low")?.count ?? 0,
    },
    {
      priority: "urgent",
      tasks: data.find((d) => d._id === "urgent")?.count ?? 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Priority</CardTitle>
        <CardDescription>Distribution of priority levels</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid />

            <PolarAngleAxis dataKey="priority" />

            <Radar
              name="Tasks"
              dataKey="tasks"
              fill="var(--chart-1)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TaskPriorityChart;

import { Label, Pie, PieChart } from "recharts";
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
    value: number;
  }[];
};

const chartConfig = {
  todo: {
    label: "To Do",
    color: "var(--chart-1)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
  blocked: {
    label: "Blocked",
    color: "var(--chart-4)",
  },
};

const TaskPieChart = ({ data }: Props) => {
  const totalTasks = data.reduce((acc, curr) => acc + curr.value, 0);

  const chartData = [
    {
      status: "completed",
      value: data.find((d) => d._id === "completed")?.value ?? 0,
      fill: "var(--chart-1)",
    },
    {
      status: "todo",
      value: data.find((d) => d._id === "todo")?.value ?? 0,
      fill: "var(--chart-2)",
    },
    {
      status: "cancelled",
      value: data.find((d) => d._id === "cancelled")?.value ?? 0,
      fill: "var(--chart-3)",
    },
    {
      status: "in-progress",
      value: data.find((d) => d._id === "in-progress")?.value ?? 0,
      fill: "var(--chart-4)",
    },
    {
      status: "review",
      value: data.find((d) => d._id === "review")?.value ?? 0,
      fill: "var(--chart-5)",
    },
    {
      status: "blocked",
      value: data.find((d) => d._id === "blocked")?.value ?? 0,
      fill: "var(--chart-6)",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>Tasks grouped by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TaskPieChart;

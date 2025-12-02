import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const { errorResponse } = await authenticateUser(["admin", "manager"]);
    if (errorResponse) return errorResponse;

    const stats = await tasks.aggregate([
      {
        $match: { isDeleted: false },
      },

      {
        $facet: {
          // OVERVIEW STATS
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                inProgress: {
                  $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
                },
                completed: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                },
                blocked: {
                  $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] },
                },
              },
            },
          ],

          // TASK DISTRIBUTION (BY STATUS)
          tasksByStatus: [
            {
              $group: {
                _id: "$status",
                value: { $sum: 1 },
              },
            },
          ],

          // TASKS BY PRIORITY
          tasksByPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ],

          // WEEKLY PROGRESS (created vs completed)
          weeklyProgress: [
            {
              $match: {
                createdAt: {
                  $gte: {
                    $dateSubtract: {
                      startDate: "$$NOW",
                      unit: "day",
                      amount: 7,
                    },
                  },
                },
              },
            },
            {
              $project: {
                day: { $dateToString: { format: "%a", date: "$createdAt" } },
                created: 1,
                completed: {
                  $cond: [
                    {
                      $and: [
                        "$completedAt",
                        {
                          $gte: [
                            "$completedAt",
                            {
                              $dateSubtract: {
                                startDate: "$$NOW",
                                unit: "day",
                                amount: 7,
                              },
                            },
                          ],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$day",
                created: { $sum: 1 },
                completed: { $sum: "$completed" },
              },
            },
            { $sort: { _id: 1 } },
          ],

          // TOP PERFORMERS
          topPerformers: [
            {
              $match: { status: "completed" },
            },
            {
              $group: {
                _id: "$createdBy",
                completed: { $sum: 1 },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $project: {
                name: "$user.name",
                avatar: "$user.initials",
                completed: 1,
                efficiency: { $multiply: ["$completed", 2] }, // dummy calc
              },
            },
            { $sort: { completed: -1 } },
            { $limit: 5 },
          ],

          //  PROJECT-WISE STATS (progress bars)
          projectStats: [
            {
              $group: {
                _id: "$project",
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                },
                inProgress: {
                  $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
                },
                blocked: {
                  $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] },
                },
              },
            },
            {
              $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "_id",
                as: "project",
              },
            },
            { $unwind: "$project" },
            {
              $project: {
                name: "$project.name",
                total: 1,
                completed: 1,
                inProgress: 1,
                blocked: 1,
              },
            },
          ],

          // UPCOMING DEADLINES (next 7 days)
          upcomingDeadlines: [
            {
              $match: {
                dueDate: {
                  $gte: "$$NOW",
                  $lte: {
                    $dateAdd: {
                      startDate: "$$NOW",
                      unit: "day",
                      amount: 7,
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
              },
            },
            { $unwind: "$project" },
            {
              $project: {
                task: "$title",
                project: "$project.name",
                dueDate: 1,
                assignee: { $arrayElemAt: ["$assignedTo", 0] },
                priority: 1,
              },
            },
          ],
        },
      },
    ]);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("GET /api/task/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task stats" },
      { status: 500 }
    );
  }
}

// const notifId = params.id;
// const notification = await Notification.aggregate([
//   { $match: { _id: new mongoose.Types.ObjectId(notifId) } },
//   {
//     $match: {
//       $or: [
//         { type: "BROADCAST", audienceType: "ALL" },
//         { type: "ROLE_BASED", audienceType: "ROLE", roles: user.role },
//         {
//           type: "DIRECT",
//           audienceType: "USER",
//           users: new mongoose.Types.ObjectId(user.id),
//         },
//       ],
//     },
//   },
//   {
//     $lookup: {
//       from: "notificationreads",
//       let: { notifId: "$_id" },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ["$notificationId", "$$notifId"] },
//                 {
//                   $eq: [
//                     "$userId",
//                     mongoose.Types.ObjectId.createFromHexString(user.id),
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       ],
//       as: "readInfo",
//     },
//   },
//   {
//     $addFields: {
//       read: { $cond: [{ $gt: [{ $size: "$readInfo" }, 0] }, true, false] },
//     },
//   },
// ]);

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

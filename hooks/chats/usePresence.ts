// "use client";
// import { useEffect } from "react";
// import { apiClient } from "@/utils/axios";
// import { useAuth } from "../useUser";

// // used for updating user online status
// export function usePresence() {
//   const { user } = useAuth();

//   async function updatePresence(isOnline: boolean) {
//     await apiClient.post("/api/chats/presence/update", {
//       isOnline,
//     });
//   }

//   useEffect(() => {
//     if (!user) return;

//     // Set online when component mounts
//     updatePresence(true);

//     // Handle visibility change
//     function handleVisibilityChange() {
//       updatePresence(!document.hidden);
//     }

//     // Handle before unload
//     function handleBeforeUnload() {
//       // Note: Modern browsers may not reliably execute this
//       updatePresence(false);
//     }
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // Heartbeat to keep presence alive
//     const heartbeatInterval = setInterval(() => {
//       if (!document.hidden) {
//         updatePresence(true);
//       }
//     }, 30000); // Every 30 seconds

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       clearInterval(heartbeatInterval);
//       updatePresence(false);
//     };
//   }, [user]);
// }

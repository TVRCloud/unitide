/* eslint-disable @typescript-eslint/no-explicit-any */

import message from "@/models/message";
import { Notification, NotificationRead } from "@/models/notification";

let started = false;
const listeners = new Set<(e: any) => void>();

export function subscribe(cb: (e: any) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit(event: any) {
  listeners.forEach((cb) => cb(event));
}

export function initStream() {
  if (started) return;
  started = true;

  /* ---------------- Notifications ---------------- */

  Notification.watch([], { fullDocument: "updateLookup" }).on("change", (e) => {
    if (e.operationType === "insert") {
      const d = e.fullDocument;
      emit({
        type: "NOTIFICATION_NEW",
        payload: {
          id: d._id.toString(),
          title: d.title,
          body: d.body,
          type: d.type,
          audienceType: d.audienceType,
          roles: d.roles,
          users: d.users,
        },
      });
    }
  });

  NotificationRead.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    (e) => {
      if (e.operationType === "insert") {
        const d = e.fullDocument;
        emit({
          type: "NOTIFICATION_READ",
          payload: {
            userId: d.userId.toString(),
            notificationId: d.notificationId.toString(),
            readAt: d.readAt,
          },
        });
      }
    }
  );

  /* ---------------- Messages ---------------- */

  message.watch([], { fullDocument: "updateLookup" }).on("change", (e) => {
    const d = e.fullDocument;

    if (!d) return;

    // 🆕 New message
    if (e.operationType === "insert") {
      emit({
        type: "MESSAGE_NEW",
        payload: {
          id: d._id.toString(),
          chatId: d.chatId.toString(),
          senderId: d.senderId.toString(),
          content: d.content,
          type: d.type,
          media: d.media,
          createdAt: d.createdAt,
        },
      });
    }

    // ✏️ Edited message
    if (
      e.operationType === "update" &&
      e.updateDescription?.updatedFields?.isEdited
    ) {
      emit({
        type: "MESSAGE_EDITED",
        payload: {
          id: d._id.toString(),
          chatId: d.chatId.toString(),
          content: d.content,
          editedAt: d.editedAt,
        },
      });
    }

    // 🗑️ Deleted message
    if (
      e.operationType === "update" &&
      e.updateDescription?.updatedFields?.isDeleted
    ) {
      emit({
        type: "MESSAGE_DELETED",
        payload: {
          id: d._id.toString(),
          chatId: d.chatId.toString(),
          deletedAt: d.deletedAt,
        },
      });
    }
  });
}

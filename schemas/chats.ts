import { z } from "zod";

export const createPrivateChatSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required"),
});

export const createGroupChatSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  participantIds: z
    .array(z.string())
    .min(1, "At least one participant is required"),
  avatar: z.string().url().optional(),
});

export const updateGroupChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
});

export const addParticipantsSchema = z.object({
  participantIds: z
    .array(z.string())
    .min(1, "At least one participant is required"),
});

export const removeParticipantSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required"),
});

export const chatActionSchema = z.object({
  action: z.enum(["archive", "unarchive", "mute", "unmute"]),
});

export type CreatePrivateChatInput = z.infer<typeof createPrivateChatSchema>;
export type CreateGroupChatInput = z.infer<typeof createGroupChatSchema>;
export type UpdateGroupChatInput = z.infer<typeof updateGroupChatSchema>;
export type AddParticipantsInput = z.infer<typeof addParticipantsSchema>;
export type RemoveParticipantInput = z.infer<typeof removeParticipantSchema>;
export type ChatActionInput = z.infer<typeof chatActionSchema>;

export const sendMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  content: z.string().optional(),
  type: z.enum(["text", "image", "video", "audio", "file"]).default("text"),
  replyTo: z.string().optional(),
});

export const markAsReadSchema = z.object({
  messageIds: z.array(z.string()).min(1, "At least one message ID is required"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;

/* eslint-disable @typescript-eslint/no-explicit-any */
type TUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

type TProject = {
  _id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  manager: TUser[];
  teams: string[];
  createdBy: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

type TRecurring = {
  isRecurring: boolean;
  interval: number;
};

export type TTask = {
  _id: string;
  title: string;
  description: string;
  project: TProject;
  teams: string[];
  assignedTo: TUser[];
  createdBy: TUser[];
  watchers: TUser[];
  status: string;
  priority: string;
  type: string;
  tags: string[];
  startDate: string;
  subtasks: any[];
  comments: any[];
  timeTracked: number;
  recurring: TRecurring;
  isDeleted: boolean;
  order: number;
  attachments: { name: string; url?: string }[];
  checklists: any[];
  timeLogs: any[];
  customFields: any[];
  createdAt: string;
  updatedAt: string;
  updatedBy: TUser[];
  attachmentUsers: TUser[];
  timeLogUsers: TUser[];
};

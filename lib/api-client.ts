import { TCreateNotificationSchema } from "@/schemas/notification";
import { TCreateTaskSchema, TUpdateTaskSchema } from "@/schemas/task";
import { apiClient } from "@/utils/axios";

type FetchTasksParams = {
  skip: number;
  limit: number;
  search: string;
  status?: string;
  priority?: string;
  projectId?: string;
  teamId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

// ---------------------------
// -----------USER------------
// ---------------------------
export const fetchUsers = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/users?${params.toString()}`);
  return res.data;
};

export const fetchSingleUser = async (id: string) => {
  const res = await apiClient.get(`/api/users/${id}`);
  return res.data;
};

export const editProfile = async (formData: FormData) => {
  const res = await apiClient.patch(`/api/me`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await apiClient.patch(`/api/me/password`, data);
  return res.data;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await apiClient.post(`/api/users`, data);
  return res.data;
};

export const editUser = async (
  id: string,
  data: {
    name: string;
    email: string;
    role: string;
  }
) => {
  const res = await apiClient.patch(`/api/users/${id}`, data);
  return res.data;
};

// ---------------------------
// -----------LOGS------------
// ---------------------------
export const fetchLogs = async ({
  skip,
  action,
  entityType,
}: {
  skip: number;
  action?: string;
  entityType?: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
  });

  if (action) params.append("action", action);
  if (entityType) params.append("entityType", entityType);

  const res = await apiClient.get(`/api/log?${params.toString()}`);
  return res.data;
};

// ---------------------------
// ----------PROJECTS---------
// ---------------------------

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await apiClient.post(`/api/projects`, data);
  return res.data;
};

export const fetchProjects = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/projects?${params.toString()}`);
  return res.data;
};

export const fetchSingleProject = async (id: string) => {
  const res = await apiClient.get(`/api/projects/${id}`);
  return res.data;
};

// ---------------------------
// -----------TEAMS------------
// ---------------------------

export const createTeam = async (data: {
  name: string;
  description?: string;
  members?: string[];
}) => {
  const res = await apiClient.post(`/api/teams`, data);
  return res.data;
};

export const fetchTeams = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/teams?${params.toString()}`);
  return res.data;
};

export const fetchSingleTeam = async (id: string) => {
  const res = await apiClient.get(`/api/teams/${id}`);
  return res.data;
};

export const editTeam = async (
  id: string,
  data: { name: string; description?: string; members?: string[] }
) => {
  const res = await apiClient.patch(`/api/teams/${id}`, data);
  return res.data;
};

export const deleteTeam = async (id: string) => {
  const res = await apiClient.delete(`/api/teams/${id}`);
  return res.data;
};

// ---------------------------
// ---------SESSIONS----------
// ---------------------------

export const fetchSessions = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/session?${params.toString()}`);
  return res.data;
};

// ---------------------------
// -------NOTIFICATION--------
// ---------------------------
export const fetchAlerts = async ({
  skip,
  search,
  type,
  audienceType,
  role,
  sortField,
  sortOrder,
}: {
  skip: number;
  search?: string;
  type?: string;
  audienceType?: string;
  role?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
  });

  if (search) params.set("search", search);
  if (type) params.set("type", type);
  if (audienceType) params.set("audienceType", audienceType);
  if (role) params.set("role", role);
  if (sortField) params.set("sortField", sortField);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const res = await apiClient.get(`/api/notifications?${params.toString()}`);

  return res.data;
};

export const fetchSingleAlert = async (id: string) => {
  const res = await apiClient.get(`/api/notifications/${id}`);
  return res.data;
};

export const createNotification = async (data: TCreateNotificationSchema) => {
  const res = await apiClient.post(`/api/notifications`, data);
  return res.data;
};

// ---------------------------
// ----------TASK-------------
// ---------------------------
export const createTask = async (data: TCreateTaskSchema) => {
  const res = await apiClient.post(`/api/task`, data);
  return res.data;
};

export const fetchTasks = async (params: FetchTasksParams) => {
  const query = new URLSearchParams();
  query.append("skip", params.skip.toString());
  query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.status) query.append("status", params.status);
  if (params.priority) query.append("priority", params.priority);
  if (params.projectId) query.append("projectId", params.projectId);
  if (params.teamId) query.append("teamId", params.teamId);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.order) query.append("order", params.order);

  const res = await apiClient.get(`/api/task?${query.toString()}`);
  return res.data;
};

export const fetchSingleTask = async (id: string) => {
  const res = await apiClient.get(`/api/task/${id}`);
  return res.data;
};

export const editTask = async (id: string, data: TUpdateTaskSchema) => {
  const res = await apiClient.patch(`/api/task/${id}`, data);
  return res.data;
};

export const editAssignees = async (id: string, data: string[]) => {
  const res = await apiClient.patch(`/api/task/${id}/assignees`, data);
  return res.data;
};
export const fetchTaskStats = async () => {
  const res = await apiClient.get(`/api/task/stats`);
  return res.data;
};

// ---------------------------
// ----------CHATS------------
// ---------------------------

export const fetchChats = async ({
  skip,
  search,
}: {
  skip: number;
  search: string;
}) => {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: "20",
    search,
  });

  const res = await apiClient.get(`/api/chats?${params.toString()}`);
  return res.data;
};

export const createPrivateChat = async (data: { participantId: string }) => {
  const res = await apiClient.post("/api/chats/private", data);
  return res;
};

// ---------------------------
// ----------UTILS------------
// ---------------------------
export async function getSignedUrl(path: string) {
  const res = await fetch(`/api/utils/sign-url?path=${path}`);
  const data = await res.json();
  return data.url as string;
}

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  color?: string;
  teams?: {
    name: string;
  }[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
};

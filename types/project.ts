export type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
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

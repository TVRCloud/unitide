# 🧩 UniTide

A modern **Task Management & Team Collaboration CRM** built using **Next.js 16 (App Router)**, **TypeScript**, **MongoDB (Mongoose)**, and **shadcn/ui**.

This project helps teams manage projects, assign tasks, collaborate, and track progress — with a clean UI, modular architecture, and robust validation powered by **Zod** and **React Hook Form**.

---

## 🚀 Tech Stack

| Category      | Technology                           |
| ------------- | ------------------------------------ |
| Frontend      | Next.js 16 (App Router) + TypeScript |
| UI Components | shadcn/ui + Tailwind CSS             |
| State & API   | TanStack Query (React Query)         |
| Forms         | React Hook Form + Zod                |
| Backend       | Next.js API Routes                   |
| Database      | MongoDB + Mongoose                   |
| Auth          | JWT-based authentication             |
| Validation    | Zod                                  |
| Icons         | Lucide React                         |

---

## 🧰 Features

### 👤 User Module

- JWT-based authentication (login/register)
- Role-based access (admin, user)
- Profile management

### 📁 Project Module

- Create / View / Edit / Delete projects
- Assign team members
- Track project status and timeline

### ✅ Task Module

- Create and assign tasks to users
- Track status: pending / in-progress / completed
- Due date and priority management

### 🧑‍🤝‍🧑 Team Module

- Create teams
- Add/remove members
- Link teams to projects

### 🧾 Client Module

- Manage client details
- Associate clients with projects

### 💬 Comment Module

- Add comments on tasks and projects
- Real-time updates (via React Query)

### 🕓 Activity Log

- Track all actions: task updates, user logins, project edits, etc.
- Stored per user and project

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/TVRCloud/unitide.git
   cd unitide
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Set environment variables**

   Create a `.env.local` file and add:

   ```env
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_secret_key"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Visit → [http://localhost:3000](http://localhost:3000)

---

## 🧠 Development Tools

| Tool                    | Purpose                         |
| ----------------------- | ------------------------------- |
| `react-hook-form`       | Form management                 |
| `zod`                   | Schema validation               |
| `@tanstack/react-query` | Server state management         |
| `shadcn/ui`             | Modern, themeable UI components |
| `lucide-react`          | Beautiful icons                 |
| `mongoose`              | MongoDB object modeling         |
| `bcrypt`                | Password hashing                |
| `jsonwebtoken`          | JWT auth                        |

---

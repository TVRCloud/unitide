import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "manager", "member", "guest"]),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(1, "Role is required."),
  avatar: z.union([z.instanceof(File), z.string()]).optional(),
});

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password must match."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;

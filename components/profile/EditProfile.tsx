"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Mail,
  Save,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TUpdateUserSchema, updateUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProfile } from "@/hooks/useUser";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  refetch: () => void;
};

const EditProfile = ({ user, refetch }: Props) => {
  const editProfile = useEditProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: undefined,
    },
  });

  const onSubmit = (data: TUpdateUserSchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    editProfile.mutate(formData, {
      onSuccess: () => {
        refetch();
        setIsEditing(false);
        toast.success("Profile updated successfully");
      },
      onError: () => toast.error("Something went wrong"),
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="w-6 h-6 text-primary" /> Edit Profile
          </CardTitle>
          <CardDescription>
            Update your personal and account information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="group"
                >
                  Edit Profile
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    {/* Avatar Upload */}
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Image
                                src={
                                  avatarPreview ||
                                  "https://via.placeholder.com/80?text=Avatar"
                                }
                                className="w-20 h-20 rounded-full object-cover"
                                width={0}
                                height={0}
                                alt="Avatar"
                                unoptimized
                              />

                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative"
                              >
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  placeholder="Your Name"
                                  className="pl-10"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative"
                              >
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input {...field} disabled className="pl-10" />
                              </motion.div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Role */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Role</FormLabel>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="relative"
                            >
                              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input {...field} disabled className="pl-10" />
                            </motion.div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={editProfile.isPending}
                      >
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </Button>

                      <Button type="submit" disabled={editProfile.isPending}>
                        {editProfile.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Profile
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;

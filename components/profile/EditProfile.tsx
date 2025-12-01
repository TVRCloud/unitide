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
                          <FormLabel className="text-base font-semibold">
                            Profile Picture
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                              {/* Avatar Preview */}
                              <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                                  <Image
                                    src={
                                      avatarPreview ||
                                      "https://via.placeholder.com/96?text=Avatar"
                                    }
                                    className="w-full h-full object-cover"
                                    width={96}
                                    height={96}
                                    alt="Avatar"
                                    unoptimized
                                  />
                                </div>
                                {avatarPreview && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <User className="w-8 h-8 text-white" />
                                  </motion.div>
                                )}
                              </motion.div>

                              {/* Upload Button */}
                              <div className="flex-1 w-full">
                                <label
                                  htmlFor="avatar-upload"
                                  className="flex flex-col items-center justify-center w-full h-32 px-4 transition-all border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted border-muted-foreground/25 hover:border-primary/50 group"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <motion.div
                                      whileHover={{ y: -4 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <User className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </motion.div>
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      <span className="font-semibold text-primary">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </div>
                                  <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file);
                                        setAvatarPreview(
                                          URL.createObjectURL(file)
                                        );
                                      }
                                    }}
                                  />
                                </label>
                                {avatarPreview && (
                                  <motion.button
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    type="button"
                                    onClick={() => {
                                      setAvatarPreview("");
                                      field.onChange(undefined);
                                    }}
                                    className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    Remove image
                                  </motion.button>
                                )}
                              </div>
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

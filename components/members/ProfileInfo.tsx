import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Calendar,
  Edit2,
  Loader2,
  Mail,
  MoreVertical,
  Save,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { TUpdateUserSchema, updateUserSchema } from "@/schemas/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useEditUser } from "@/hooks/useUser";
import { toast } from "sonner";

type Props = {
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};

const ProfileInformation = ({ data }: Props) => {
  const editUser = useEditUser(data._id);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      role: data?.role || "",
    },
    values: {
      name: data?.name || "",
      email: data?.email || "",
      role: data?.role || "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (data: TUpdateUserSchema) => {
    await editUser.mutateAsync(data, {
      onSuccess: () => {
        setIsEditing(false);
        form.reset();
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong");
      },
    });
  };

  const roles = ["admin", "manager", "lead", "member", "guest"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Edit user profile details"
                    : "View user profile details"}
                </CardDescription>
              </div>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button
                      onClick={handleEdit}
                      size="sm"
                      className="sm:h-10"
                      type="button"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 sm:w-10 sm:h-10"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={editUser.isPending}
                      type="button"
                      size="sm"
                      className="sm:h-10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={editUser.isPending}
                      size="sm"
                      className="sm:h-10"
                    >
                      {editUser.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <CardContent className="overflow-hidden">
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative flex items-center rounded-md border px-3 py-2 text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{data.name}</span>
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative flex items-center rounded-md border px-3 py-2 text-sm">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{data.email}</span>
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <div className="rounded-md border px-3 py-2 text-sm capitalize text-foreground">
                          {data.role}
                        </div>
                      </FormItem>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem
                                    key={role}
                                    value={role}
                                    className="capitalize"
                                  >
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Important dates and status</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground">User ID:</p>
                  <p className="font-mono text-xs">{data._id.slice(-8)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Created:
                  </p>
                  <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Updated:
                  </p>
                  <p>{new Date(data.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
};

export default ProfileInformation;

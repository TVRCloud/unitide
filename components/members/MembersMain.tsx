"use client";

import { useInfiniteUsers } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Mail,
  Search,
  SlidersHorizontal,
  TableOfContents,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { HeaderSection } from "../ui/header-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useInView } from "react-intersection-observer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DateTime } from "luxon";
import AddMember from "./AddMember";
import { useRouter } from "next/navigation";
import ChatWithUser from "./ChatWithUser";
import MemberAvatar from "./MemberAvatar";

const MembersMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelected = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteUsers(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredUsers = data?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Members"
        subtitle="Manage your organization's members."
        actions={<AddMember />}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              A list of all users in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {selected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-sm font-medium">
                    {selected.length} user
                    {selected.length > 1 ? "s" : ""} selected
                  </span>
                </motion.div>
              )}
            </div>

            <Separator />

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={
                            filteredUsers.length > 0 &&
                            selected.length === filteredUsers.length
                          }
                          onCheckedChange={(checked) =>
                            setSelected(
                              checked ? filteredUsers.map((f) => f._id) : []
                            )
                          }
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                              {Array(6)
                                .fill(0)
                                .map((_, j) => (
                                  <TableCell key={j}>
                                    <Skeleton className="h-4 w-[100px]" />
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))
                        : filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <Checkbox
                                  checked={selected.includes(user._id)}
                                  onCheckedChange={() =>
                                    toggleSelected(user._id)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <MemberAvatar user={user} />

                                  <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="gap-1">
                                  {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    user.isActive ? "secondary" : "outline"
                                  }
                                  className="gap-1"
                                >
                                  <div
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      user.isActive
                                        ? "bg-green-500"
                                        : "bg-muted-foreground"
                                    }`}
                                  />
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {DateTime.fromISO(
                                  user.createdAt
                                ).toLocaleString(DateTime.DATETIME_MED)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <TableOfContents />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        router.push(`/members/${user._id}`);
                                      }}
                                    >
                                      <User className="mr-2 h-4 w-4" />
                                      View User
                                    </DropdownMenuItem>

                                    <ChatWithUser
                                      userId={user._id}
                                      userName={user.name}
                                    />
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-center" ref={ref}>
              <span className="p-4 text-center text-muted-foreground text-xs">
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Scroll to load more"
                  : "No more users"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MembersMain;

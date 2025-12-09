import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useSignedImage } from "@/hooks/useSignedImage";

interface TeamMember {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

const MemberItem = ({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) => {
  const { data: url } = useSignedImage(member?.avatar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center space-x-4 p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={url || ""} />
        <AvatarFallback className="text-xs font-semibold">
          {member.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {member.role}
        </p>
      </div>
      <Badge
        variant={member.isActive ? "default" : "secondary"}
        className="text-xs w-16 justify-center"
      >
        {member.isActive ? "Active" : "Inactive"}
      </Badge>
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default MemberItem;

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  user: {
    avatar: string;
    name: string;
  };
}

const MemberAvatar = ({ user }: Props) => {
  return (
    <Avatar className="h-9 w-9">
      <AvatarImage src={user.avatar} />
      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground font-semibold">
        {user.name
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()}{" "}
      </AvatarFallback>
    </Avatar>
  );
};

export default MemberAvatar;

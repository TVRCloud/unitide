import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AssigneeSelector from "./AssigneeSelector";
import { useState } from "react";
import { SignedAvatar } from "../ui/signed-avatar";

type Props = {
  assignees: {
    _id: string;
    name: string;
    avatar?: string;
  }[];
  id: string;
};

const TaskAssignees = ({ assignees, id }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assignees</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {assignees.length === 0 && (
          <p className="text-muted-foreground">No assignees</p>
        )}

        {assignees.map((u) => {
          return (
            <div key={u._id} className="flex items-center gap-3">
              <SignedAvatar src={u.avatar} name={u.name} />
              <span className="font-medium">{u.name}</span>
            </div>
          );
        })}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Assignee
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Assignees</DialogTitle>
              <DialogDescription>
                Select assignees for this task
              </DialogDescription>
            </DialogHeader>

            <AssigneeSelector setOpen={setOpen} assignees={assignees} id={id} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TaskAssignees;

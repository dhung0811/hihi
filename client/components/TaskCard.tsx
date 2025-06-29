import { useState } from "react";
import {
  Clock,
  User,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatus } from "@/types/task";
import { CommentSection } from "./CommentSection";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [showComments, setShowComments] = useState(false);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Done":
        return "bg-success text-success-foreground";
      case "In Progress":
        return "bg-warning text-warning-foreground";
      case "Pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 border-2 border-transparent hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {task.title}
            </h3>
            <Badge className={`${getStatusColor(task.status)} mb-2`}>
              {task.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {task.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned by:</span>
            <span className="font-medium">{task.assignment}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned:</span>
            <span className="font-medium">{formatTime(task.assignedTime)}</span>
          </div>

          {task.completedTime && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-medium text-success">
                {formatTime(task.completedTime)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            {task.status !== "Done" && (
              <Button
                size="sm"
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === "Pending" ? "In Progress" : "Done",
                  )
                }
                className="bg-primary hover:bg-primary/90"
              >
                {task.status === "Pending" ? "Start" : "Complete"}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Comments ({task.comments.length})
          </Button>
        </div>

        {showComments && (
          <CommentSection taskId={task.id} comments={task.comments} />
        )}
      </CardContent>
    </Card>
  );
}

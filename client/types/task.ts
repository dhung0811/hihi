export type TaskStatus = "Pending" | "In Progress" | "Done";

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignment: string;
  assignedTime: Date;
  completedTime?: Date;
  status: TaskStatus;
  category: string;
  comments: Comment[];
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

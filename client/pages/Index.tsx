import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskDialog } from "@/components/TaskDialog";
import { Task, TaskStatus } from "@/types/task";

// Mock data
const CATEGORIES = [
  "Development",
  "Design",
  "Meeting",
  "Documentation",
  "Testing",
  "Review",
];

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "example....",
    description: "description....",
    assignment: "Ngoc Tram",
    assignedTime: new Date(2024, 0, 15, 9, 0),
    completedTime: new Date(2024, 0, 16, 17, 30),
    status: "Done",
    category: "Development",
    comments: [
      {
        id: "c1",
        author: "Ngoc Tram",
        content: "Great work on the implementation!",
        timestamp: new Date(2024, 0, 16, 18, 0),
      },
    ],
  },
  {
    id: "2",
    title: "example....",
    description: "description....",
    assignment: "Ngoc Tram",
    assignedTime: new Date(2024, 0, 16, 14, 0),
    status: "In Progress",
    category: "Design",
    comments: [],
  },
  {
    id: "3",
    title: "example....",
    description: "Discuss project progress and blockers.",
    assignment: "Emily Davis",
    assignedTime: new Date(2024, 0, 17, 10, 0),
    status: "Pending",
    category: "Meeting",
    comments: [],
  },
  {
    id: "4",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples.",
    assignment: "David Kim",
    assignedTime: new Date(2024, 0, 15, 11, 0),
    status: "In Progress",
    category: "Documentation",
    comments: [],
  },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    return { total, completed, inProgress, pending };
  }, [tasks]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Done":
        return "bg-success text-success-foreground";
      case "In Progress":
        return "bg-warning text-warning-foreground";
      case "Pending":
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreateTask = (taskData: Omit<Task, "id" | "comments">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      comments: [],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleEditTask = (taskData: Omit<Task, "id" | "comments">) => {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id ? { ...task, ...taskData } : task,
      ),
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedTime: status === "Done" ? new Date() : undefined,
            }
          : task,
      ),
    );
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-gradient-to-b from-journal-100 via-journal-50 to-background overflow-hidden flex flex-col">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-primary/10 via-journal-100/80 to-primary/5 backdrop-blur-sm border-b px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {getInitials("Good Morning")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Good morning</p>
              <p className="font-semibold text-foreground">user,...</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 h-8 px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-journal-600 bg-clip-text text-transparent mb-1">
          Daily Work Journal
        </h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <p className="text-lg font-bold text-success">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Done</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <p className="text-lg font-bold text-warning">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-2 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-20 h-9">
              <Filter className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate mb-1">
                      {task.title}
                    </h3>
                    <Badge
                      className={`${getStatusColor(task.status)} text-xs px-2 py-0.5`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => openEditDialog(task)}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {task.description}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">By:</span>
                    <span className="font-medium text-foreground">
                      {task.assignment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">Assigned:</span>
                    <span className="font-medium text-foreground">
                      {formatTime(task.assignedTime)}
                    </span>
                  </div>
                  {task.completedTime && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium text-success">
                        {formatTime(task.completedTime)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <div className="flex gap-1">
                    {task.status !== "Done" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            task.id,
                            task.status === "Pending" ? "In Progress" : "Done",
                          )
                        }
                        className="h-6 px-2 text-xs bg-primary hover:bg-primary/90"
                      >
                        {task.status === "Pending" ? "Start" : "Complete"}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{task.comments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <Card className="bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No tasks found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={editingTask ? handleEditTask : handleCreateTask}
        task={editingTask}
        categories={CATEGORIES}
      />
    </div>
  );
}

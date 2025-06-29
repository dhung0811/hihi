import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "@/components/TaskCard";
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
    title: "Implement user authentication system",
    description:
      "Build a secure login and registration system with JWT tokens and password encryption. Include email verification and password reset functionality.",
    assignment: "Sarah Johnson",
    assignedTime: new Date(2024, 0, 15, 9, 0),
    completedTime: new Date(2024, 0, 16, 17, 30),
    status: "Done",
    category: "Development",
    comments: [
      {
        id: "c1",
        author: "Sarah Johnson",
        content:
          "Great work on the implementation! The security measures are well thought out.",
        timestamp: new Date(2024, 0, 16, 18, 0),
      },
      {
        id: "c2",
        author: "Mike Chen",
        content:
          "Consider adding two-factor authentication for enhanced security.",
        timestamp: new Date(2024, 0, 17, 10, 15),
      },
    ],
  },
  {
    id: "2",
    title: "Design homepage wireframes",
    description:
      "Create wireframes for the new homepage layout focusing on user experience and conversion optimization.",
    assignment: "Alex Rodriguez",
    assignedTime: new Date(2024, 0, 16, 14, 0),
    status: "In Progress",
    category: "Design",
    comments: [
      {
        id: "c3",
        author: "Alex Rodriguez",
        content:
          "Looking forward to seeing the mobile-first approach in action.",
        timestamp: new Date(2024, 0, 16, 15, 30),
      },
    ],
  },
  {
    id: "3",
    title: "Weekly team standup meeting",
    description:
      "Discuss project progress, blockers, and plan for the upcoming week.",
    assignment: "Emily Davis",
    assignedTime: new Date(2024, 0, 17, 10, 0),
    status: "Pending",
    category: "Meeting",
    comments: [],
  },
  {
    id: "4",
    title: "Write API documentation",
    description:
      "Document all REST API endpoints with examples and response formats for the authentication service.",
    assignment: "David Kim",
    assignedTime: new Date(2024, 0, 15, 11, 0),
    status: "In Progress",
    category: "Documentation",
    comments: [
      {
        id: "c4",
        author: "David Kim",
        content: "Please include error handling examples in the documentation.",
        timestamp: new Date(2024, 0, 15, 12, 0),
      },
    ],
  },
  {
    id: "5",
    title: "Test payment integration",
    description:
      "Comprehensive testing of the payment gateway integration including success and failure scenarios.",
    assignment: "Lisa Wang",
    assignedTime: new Date(2024, 0, 16, 13, 0),
    status: "Pending",
    category: "Testing",
    comments: [],
  },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || task.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tasks, searchQuery, selectedCategory, selectedStatus]);

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const grouped = filteredTasks.reduce(
      (acc, task) => {
        if (!acc[task.category]) {
          acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
      },
      {} as Record<string, Task[]>,
    );

    return grouped;
  }, [filteredTasks]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;

    return { total, completed, inProgress, pending };
  }, [tasks]);

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
    <div className="min-h-screen bg-gradient-to-br from-journal-100 via-journal-50 to-background">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-journal-600 bg-clip-text text-transparent">
                Daily Work Journal
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your daily tasks and collaborate with your team
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.inProgress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Category */}
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-journal-50 to-journal-100/50">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    {category}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {categoryTasks.length} tasks
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categoryTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(tasksByCategory).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
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

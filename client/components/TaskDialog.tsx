import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus } from "@/types/task";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "comments">) => void;
  task?: Task | null;
  categories: string[];
}

export function TaskDialog({
  isOpen,
  onClose,
  onSave,
  task,
  categories,
}: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignment: "",
    category: "",
    status: "Pending" as TaskStatus,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignment: task.assignment,
        category: task.category,
        status: task.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignment: "",
        category: categories[0] || "",
        status: "Pending",
      });
    }
  }, [task, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      ...formData,
      assignedTime: task?.assignedTime || new Date(),
      completedTime:
        formData.status === "Done" && !task?.completedTime
          ? new Date()
          : task?.completedTime,
    };

    onSave(taskData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[350px] max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title..."
              className="h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the task details..."
              className="min-h-[60px] text-sm resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignment" className="text-sm">
              Assigned By
            </Label>
            <Input
              id="assignment"
              value={formData.assignment}
              onChange={(e) => handleInputChange("assignment", e.target.value)}
              placeholder="Manager name..."
              className="h-9 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as TaskStatus)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-9 text-sm">
              {task ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

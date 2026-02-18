import { format, differenceInDays, isBefore } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import type { Priority, DisplayTodo } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodoCardProps {
  todo: DisplayTodo;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityConfig: Record<Priority, { label: string; variant: "destructive" | "secondary" | "outline" }> = {
    high: { label: "High", variant: "destructive" },
    medium: { label: "Medium", variant: "secondary" },
    low: { label: "Low", variant: "outline" },
};


export function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const dueDate = todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate);
  const isDone = todo.state.toLowerCase() === 'done' || todo.state.toLowerCase() === 'completed';

  const daysRemaining = differenceInDays(dueDate, new Date());

  const isOverdue = !isDone && isBefore(dueDate, new Date());
  const isApproaching = !isDone && !isOverdue && daysRemaining <= 2;

  const { label, variant } = priorityConfig[todo.priority];

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card onClick={onEdit} className="cursor-pointer transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold leading-tight pr-2">{todo.label}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 flex-shrink-0"
              onClick={handleDropdownClick}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDropdownClick}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }} 
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {todo.description && (
          <p className="mb-3 text-sm text-muted-foreground break-words line-clamp-2">
            {todo.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Badge variant={variant} className="text-xs font-medium">
              {label}
            </Badge>
            <Badge variant="outline" className="text-xs">{todo.state}</Badge>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
              isOverdue && "bg-destructive/20 text-destructive",
              isApproaching && "bg-warning/20 text-warning",
              !isOverdue && !isApproaching && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-3 w-3" />
            <span>{format(dueDate, "MMM d")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

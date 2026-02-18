import { format, formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarIcon,
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
} from "lucide-react";
import type { Priority, DisplayTodo } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TodoCardProps {
  todo: DisplayTodo;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityIcons: Record<
  Priority,
  { icon: React.ElementType; className: string }
> = {
  low: { icon: ArrowDownCircle, className: "text-green-500" },
  medium: { icon: MinusCircle, className: "text-yellow-500" },
  high: { icon: ArrowUpCircle, className: "text-red-500" },
};

export function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const PriorityIcon = priorityIcons[todo.priority].icon;

  const dueDate = todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate);
  const createdAt = todo.createdAt instanceof Date ? todo.createdAt : new Date(todo.createdAt);
  const isOverdue = new Date() > dueDate && todo.state !== "Done";

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{todo.label}</CardTitle>
          <CardDescription>
            Created {formatDistanceToNow(createdAt, { addSuffix: true })}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PriorityIcon
                  className={cn(
                    "h-5 w-5",
                    priorityIcons[todo.priority].className
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Priority:{" "}
                  {todo.priority.charAt(0).toUpperCase() +
                    todo.priority.slice(1)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge variant="outline">{todo.state}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            "flex items-center text-sm text-muted-foreground",
            isOverdue && "text-destructive font-medium"
          )}
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>{isOverdue ? "Overdue:" : "Due:"} {format(dueDate, "PPP")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

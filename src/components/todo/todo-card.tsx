import { format } from "date-fns";
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
  const isOverdue = new Date() > dueDate && todo.state !== "Done";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold leading-tight">{todo.label}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0">
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
      <CardContent className="p-4 pt-0">
        {todo.description && (
          <p className="mb-2 text-sm text-muted-foreground break-words">
            {todo.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
            <Badge variant="outline" className="text-xs">{todo.state}</Badge>
          </div>
          <div
            className={cn(
              "flex items-center text-xs",
              isOverdue && "text-destructive font-medium"
            )}
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>{format(dueDate, "MMM d")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import type { DisplayTodo } from "@/lib/types";
import { TodoCard } from "./todo-card";
import { FileQuestion } from "lucide-react";

interface TodoListProps {
  todos: DisplayTodo[];
  onEdit: (todo: DisplayTodo) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <FileQuestion className="h-12 w-12" />
          <h3 className="text-2xl font-bold tracking-tight">No tasks found</h3>
          <p className="text-sm">
            Try adjusting your filters or create a new task.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onEdit={() => onEdit(todo)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </div>
  );
}

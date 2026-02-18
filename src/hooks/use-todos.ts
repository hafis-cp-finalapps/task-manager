"use client";

import useLocalStorage from "./use-local-storage";
import type { Todo } from "@/lib/types";
import { initialTodos } from "@/lib/data";

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("taskflow-todos", initialTodos);

  const addTodo = (todoData: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todoData,
      id: new Date().toISOString(),
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = (id: string, updatedData: Partial<Omit<Todo, "id" | "createdAt">>) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedData } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, updateTodo, deleteTodo };
}

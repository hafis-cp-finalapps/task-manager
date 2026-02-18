"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTodos } from "@/hooks/use-todos";
import { useSettings } from "@/hooks/use-settings";
import type { Priority, Todo, DisplayTodo, State } from "@/lib/types";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Header } from "@/components/header";
import { TodoToolbar } from "@/components/todo/todo-toolbar";
import { TodoList } from "@/components/todo/todo-list";
import { TodoForm } from "@/components/todo/todo-form";
import { Timestamp } from "firebase/firestore";

export default function TodosPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const { states, addState, isSettingsLoading } = useSettings();

  const [editingTodo, setEditingTodo] = useState<DisplayTodo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  const openFormForNew = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (todo: DisplayTodo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
    } else {
      addTodo(todoData);
    }
    closeForm();
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const displayTodos = useMemo((): DisplayTodo[] => {
    if (!todos || !states) return [];
    const stateMap = new Map(states.map((s) => [s.id, s.name]));
    return todos.map((todo) => ({
      ...todo,
      state: stateMap.get(todo.stateId) || "Unknown",
      dueDate: (todo.dueDate as Timestamp)?.toDate() || new Date(todo.dueDate as string),
      createdAt: (todo.createdAt as Timestamp)?.toDate() || new Date(todo.createdAt as string),
      updatedAt: (todo.updatedAt as Timestamp)?.toDate() || new Date(todo.updatedAt as string),
    }));
  }, [todos, states]);

  const filteredTodos = useMemo(() => {
    const stateIdFilterSet = new Set(states.filter(s => stateFilter.includes(s.name)).map(s => s.id));

    return displayTodos
      .filter((todo) =>
        todo.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (todo) =>
          priorityFilter.length === 0 || priorityFilter.includes(todo.priority)
      )
      .filter(
        (todo) =>
          stateIdFilterSet.size === 0 || stateIdFilterSet.has(todo.stateId)
      );
  }, [displayTodos, searchTerm, priorityFilter, stateFilter, states]);
  
  if (isUserLoading || isSettingsLoading) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <TodoToolbar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          onAddTodo={openFormForNew}
          availableStates={states.map(s => s.name)}
        />
        <TodoList
          todos={filteredTodos}
          onEdit={openFormForEdit}
          onDelete={handleDeleteTodo}
        />
      </main>
      <TodoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSaveTodo}
        todo={editingTodo}
        availableStates={states}
      />
    </div>
  );
}

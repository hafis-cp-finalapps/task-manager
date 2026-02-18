"use client";

import React, { useState, useMemo } from "react";
import { useTodos } from "@/hooks/use-todos";
import { useSettings } from "@/hooks/use-settings";
import type { Priority, Todo } from "@/lib/types";

import { Header } from "@/components/header";
import { TodoToolbar } from "@/components/todo/todo-toolbar";
import { TodoList } from "@/components/todo/todo-list";
import { TodoForm } from "@/components/todo/todo-form";

export default function Home() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const { states } = useSettings();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);

  const openFormForNew = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = (todoData: Omit<Todo, "id" | "createdAt">) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, { ...editingTodo, ...todoData });
    } else {
      addTodo(todoData);
    }
    closeForm();
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) =>
        todo.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (todo) =>
          priorityFilter.length === 0 || priorityFilter.includes(todo.priority)
      )
      .filter(
        (todo) =>
          stateFilter.length === 0 || stateFilter.includes(todo.state)
      );
  }, [todos, searchTerm, priorityFilter, stateFilter]);

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
          availableStates={states}
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

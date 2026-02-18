"use client";

import { useCollection, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { Todo } from "@/lib/types";

export function useTodos() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const todosQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/todos`);
  }, [firestore, user]);
  
  const { data: todos, isLoading, error } = useCollection<Todo>(todosQuery);

  const addTodo = (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!todosQuery || !user) return;
    const newTodo = {
      ...todoData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDocumentNonBlocking(todosQuery, newTodo);
  };

  const updateTodo = (id: string, updatedData: Partial<Omit<Todo, "id" | "createdAt" | "userId">>) => {
    if(!user) return;
    const docRef = doc(firestore, `users/${user.uid}/todos/${id}`);
    updateDocumentNonBlocking(docRef, { ...updatedData, updatedAt: serverTimestamp() });
  };

  const deleteTodo = (id: string) => {
    if(!user) return;
    const docRef = doc(firestore, `users/${user.uid}/todos/${id}`);
    deleteDocumentNonBlocking(docRef);
  };

  return { todos: todos || [], addTodo, updateTodo, deleteTodo, isLoading, error };
}

"use client";

import { useCollection, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { Todo } from "@/lib/types";
import { useUserProfile } from "./use-user-profile";

export function useTodos() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { profile } = useUserProfile();

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
    
    const docPromise = addDocumentNonBlocking(todosQuery, newTodo);

    if (profile?.webhookUrl) {
      docPromise.then(docRef => {
        const payload = {
          ...todoData,
          id: docRef.id,
          userId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        fetch(profile.webhookUrl!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch(err => {
          console.error("Webhook POST failed:", err);
        });
      });
    }
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

    
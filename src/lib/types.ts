import type { Timestamp } from 'firebase/firestore';

export type Priority = "low" | "medium" | "high";

export interface State {
  id: string;
  name: string;
  userId: string;
  order?: number;
  colorHex?: string;
}

export interface Todo {
  id: string;
  label: string;
  description?: string;
  dueDate: Timestamp | Date | string;
  priority: Priority;
  stateId: string;
  userId: string;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
}

export interface DisplayTodo extends Omit<Todo, 'dueDate' | 'createdAt' | 'updatedAt'> {
  state: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

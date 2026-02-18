import type { Todo } from "./types";

export const initialTodos: Todo[] = [
  {
    id: "1",
    label: "Design the new landing page",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: "high",
    state: "In Progress",
    createdAt: new Date(),
  },
  {
    id: "2",
    label: "Develop the authentication feature",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: "high",
    state: "To-do",
    createdAt: new Date(),
  },
  {
    id: "3",
    label: "Fix bug #123 on the dashboard",
    dueDate: new Date(),
    priority: "medium",
    state: "Done",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: "4",
    label: "Write documentation for the API",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    priority: "low",
    state: "To-do",
    createdAt: new Date(),
  },
  {
    id: "5",
    label: "Deploy version 2.0 to production",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: "high",
    state: "To-do",
    createdAt: new Date(),
  },
    {
    id: "6",
    label: "Refactor old component library",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    priority: "low",
    state: "Canceled",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
];

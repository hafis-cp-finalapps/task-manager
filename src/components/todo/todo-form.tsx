"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import type { DisplayTodo, State, Todo, Priority } from "@/lib/types";
import { PRIORITIES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  stateId: z.string().min(1, "State is required"),
  dueDate: z.date({ required_error: "A due date is required." }),
});

type FormValues = z.infer<typeof formSchema>;

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Todo, "id" | "createdAt" | "updatedAt" | "userId">) => void;
  todo: DisplayTodo | null;
  availableStates: State[];
}

const priorityConfig: Record<Priority, { label: string; color: string; ring: string }> = {
  low: { label: "Low", color: "bg-sky-500", ring: "ring-sky-500" },
  medium: { label: "Medium", color: "bg-orange-500", ring: "ring-orange-500" },
  high: { label: "High", color: "bg-red-500", ring: "ring-red-500" },
};

export function TodoForm({
  isOpen,
  onClose,
  onSave,
  todo,
  availableStates,
}: TodoFormProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      description: "",
      priority: "medium",
      stateId: availableStates[0]?.id || "",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (todo) {
        const todoState = availableStates.find(s => s.name === todo.state);
        form.reset({
          label: todo.label,
          description: todo.description || "",
          priority: todo.priority,
          stateId: todoState?.id,
          dueDate: todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate),
        });
      } else {
        const defaultState = availableStates.find(s => s.name.toLowerCase() === 'to-do') || availableStates[0];
        form.reset({
          label: "",
          description: "",
          priority: "medium",
          stateId: defaultState?.id || "",
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        });
      }
    }
  }, [todo, isOpen, form, availableStates]);

  const onSubmit = (data: FormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {todo
              ? "Update the details of your task."
              : "Fill out the form to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Finalize project report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-full"
                        value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                             // The input gives a string like "2024-07-26". 
                             // Appending T00:00:00 makes it parse in the user's local timezone.
                            field.onChange(new Date(e.target.value + 'T00:00:00'));
                          } else {
                            field.onChange(null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center justify-around pt-2"
                      >
                        {PRIORITIES.map((p) => {
                          const config = priorityConfig[p.value];
                          return (
                            <FormItem key={p.value} className="flex items-center space-x-0 space-y-0">
                               <FormControl>
                                <RadioGroupItem value={p.value} id={p.value} className="sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={p.value}
                                className="flex cursor-pointer flex-col items-center gap-2 rounded-md p-2 hover:bg-accent"
                              >
                                <span
                                  className={cn(
                                    "h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-background",
                                    config.color,
                                    field.value === p.value ? config.ring : "ring-transparent"
                                  )}
                                />
                                <span className="text-xs font-medium">{config.label}</span>
                              </FormLabel>
                            </FormItem>
                          );
                         })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {availableStates.map((s) => (
                        <FormItem key={s.id} className="flex items-center space-x-0 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={s.id} id={'state-' + s.id} className="sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor={'state-' + s.id}
                            className={cn(
                              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                              field.value === s.id
                                ? "border-transparent bg-primary text-primary-foreground"
                                : "border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            {s.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a more detailed description..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

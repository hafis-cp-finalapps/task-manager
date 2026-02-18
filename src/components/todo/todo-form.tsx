"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import type { Priority, Todo } from "@/lib/types";
import { PRIORITIES } from "@/lib/constants";
import { getAiSuggestion } from "@/lib/actions";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  priority: z.enum(["low", "medium", "high"]),
  state: z.string().min(1, "State is required"),
  dueDate: z.date({ required_error: "A due date is required." }),
});

type FormValues = z.infer<typeof formSchema>;

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => void;
  todo: Todo | null;
  availableStates: string[];
}

export function TodoForm({
  isOpen,
  onClose,
  onSave,
  todo,
  availableStates,
}: TodoFormProps) {
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      priority: "medium",
      state: availableStates[0] || "",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        label: todo.label,
        priority: todo.priority,
        state: todo.state,
        dueDate: new Date(todo.dueDate),
      });
    } else {
      form.reset({
        label: "",
        priority: "medium",
        state: availableStates.find(s => s.toLowerCase() === 'to-do') || availableStates[0] || "",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      });
    }
  }, [todo, isOpen, form, availableStates]);

  const handleAiSuggest = () => {
    const { label, dueDate } = form.getValues();
    if (!label) {
      form.setError("label", { message: "Please enter a label for AI suggestion." });
      return;
    }
    startAiTransition(async () => {
      const suggestedState = await getAiSuggestion({
        description: label,
        dueDate: format(dueDate, "yyyy-MM-dd"),
        availableStates,
      });
      if (suggestedState && availableStates.includes(suggestedState)) {
        form.setValue("state", suggestedState, { shouldValidate: true });
      }
    });
  };

  const onSubmit = (data: FormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {todo
              ? "Update the details of your task."
              : "Fill out the form to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAiSuggest}
                      disabled={isAiPending}
                      aria-label="Suggest State with AI"
                    >
                      {isAiPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                  </div>
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

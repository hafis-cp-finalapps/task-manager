"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter, PlusCircle, Search } from "lucide-react";
import type { Priority } from "@/lib/types";
import { PRIORITIES } from "@/lib/constants";

interface TodoToolbarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  priorityFilter: Priority[];
  onPriorityFilterChange: (priorities: Priority[]) => void;
  stateFilter: string[];
  onStateFilterChange: (states: string[]) => void;
  onAddTodo: () => void;
  availableStates: string[];
}

export function TodoToolbar({
  searchTerm,
  onSearchTermChange,
  priorityFilter,
  onPriorityFilterChange,
  stateFilter,
  onStateFilterChange,
  onAddTodo,
  availableStates,
}: TodoToolbarProps) {

  const handlePriorityToggle = (priority: Priority) => {
    const newFilter = priorityFilter.includes(priority)
      ? priorityFilter.filter((p) => p !== priority)
      : [...priorityFilter, priority];
    onPriorityFilterChange(newFilter);
  };
  
  const handleStateToggle = (state: string) => {
    const newFilter = stateFilter.includes(state)
      ? stateFilter.filter((s) => s !== state)
      : [...stateFilter, state];
    onStateFilterChange(newFilter);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PRIORITIES.map((p) => (
              <DropdownMenuCheckboxItem
                key={p.value}
                checked={priorityFilter.includes(p.value)}
                onCheckedChange={() => handlePriorityToggle(p.value)}
              >
                {p.label}
              </DropdownMenuCheckboxItem>
            ))}
             <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by State</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableStates.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={stateFilter.includes(s)}
                onCheckedChange={() => handleStateToggle(s)}
              >
                {s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button size="sm" className="h-10 gap-1" onClick={onAddTodo}>
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Task
        </span>
      </Button>
    </div>
  );
}

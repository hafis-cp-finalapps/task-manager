"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function SettingsForm() {
  const { states, addState, deleteState } = useSettings();
  const [newState, setNewState] = useState("");

  const handleAddState = () => {
    if (newState.trim()) {
      addState(newState.trim());
      setNewState("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom States</CardTitle>
        <CardDescription>
          Add or remove custom states for your todo items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              placeholder="New state name"
              onKeyDown={(e) => e.key === "Enter" && handleAddState()}
            />
            <Button onClick={handleAddState}>Add State</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <Badge key={state} variant="secondary" className="group text-sm pl-3 pr-1 py-1">
                {state}
                <button
                  onClick={() => deleteState(state)}
                  className="ml-2 rounded-full p-0.5 text-muted-foreground outline-none ring-offset-background transition-colors hover:bg-background/50 hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Delete {state}</span>
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

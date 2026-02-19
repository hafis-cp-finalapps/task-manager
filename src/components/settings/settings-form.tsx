"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import type { State } from "@/lib/types";
import { useUserProfile } from "@/hooks/use-user-profile";

export function SettingsForm() {
  const { states, addState, deleteState } = useSettings();
  const [newState, setNewState] = useState("");

  const { profile, updateUserProfile, isLoading: isProfileLoading } = useUserProfile();
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (profile && typeof profile.webhookUrl === 'string') {
      setWebhookUrl(profile.webhookUrl);
    } else if (profile && !profile.webhookUrl) {
      setWebhookUrl('');
    }
  }, [profile]);

  const handleAddState = () => {
    if (newState.trim()) {
      addState(newState.trim());
      setNewState("");
    }
  };

  const handleSaveWebhook = () => {
    updateUserProfile({ webhookUrl: webhookUrl });
  };

  return (
    <>
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
              {states.map((state: State) => (
                <Badge key={state.id} variant="secondary" className="group text-sm pl-3 pr-1 py-1">
                  {state.name}
                  <button
                    onClick={() => deleteState(state.id)}
                    className="ml-2 rounded-full p-0.5 text-muted-foreground outline-none ring-offset-background transition-colors hover:bg-background/50 hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Delete {state.name}</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <CardDescription>
            Provide a URL to receive a POST request whenever a new task is created. The task data will be sent as JSON in the request body.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProfileLoading && !profile ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
               <Loader2 className="h-5 w-5 animate-spin" />
               <span>Loading webhook settings...</span>
            </div>
          ) : (
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-webhook-url.com/hook"
            />
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSaveWebhook} disabled={isProfileLoading && !profile}>Save Webhook</Button>
        </CardFooter>
      </Card>
    </>
  );
}

    
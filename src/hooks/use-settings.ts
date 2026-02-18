"use client";

import useLocalStorage from "./use-local-storage";
import { DEFAULT_STATES } from "@/lib/constants";

export function useSettings() {
  const [states, setStates] = useLocalStorage<string[]>(
    "taskflow-states",
    DEFAULT_STATES
  );

  const addState = (newState: string) => {
    if (newState && !states.includes(newState)) {
      setStates([...states, newState]);
    }
  };

  const deleteState = (stateToDelete: string) => {
    setStates(states.filter((state) => state !== stateToDelete));
  };

  return { states, addState, deleteState };
}

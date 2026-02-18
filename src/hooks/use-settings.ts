"use client";

import { useCollection, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { DEFAULT_STATES } from "@/lib/constants";
import { State } from "@/lib/types";
import { useEffect } from "react";

export function useSettings() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const statesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/states`);
  }, [firestore, user]);

  const { data: states, isLoading: isSettingsLoading } = useCollection<State>(statesQuery);

  useEffect(() => {
    if (user && states?.length === 0) {
      // New user, create default states
      const batch = writeBatch(firestore);
      DEFAULT_STATES.forEach((stateName) => {
        const stateDocRef = doc(collection(firestore, `users/${user.uid}/states`));
        batch.set(stateDocRef, {
          name: stateName,
          userId: user.uid,
        });
      });
      batch.commit();
    }
  }, [user, states, firestore]);

  const addState = (newStateName: string) => {
    if (!user || !statesQuery) return;
    if (newStateName && !states?.some(s => s.name === newStateName)) {
      addDocumentNonBlocking(statesQuery, { name: newStateName, userId: user.uid });
    }
  };

  const deleteState = (stateId: string) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user.uid}/states/${stateId}`);
    deleteDocumentNonBlocking(docRef);
  };

  return { states: states || [], addState, deleteState, isSettingsLoading };
}
